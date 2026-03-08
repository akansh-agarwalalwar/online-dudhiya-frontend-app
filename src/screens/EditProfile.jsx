import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  BackHandler,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Camera, AlertCircle, CheckCircle, Shield, User } from "lucide-react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import COLORS from "../constants/Color";
import ProfileRow from "../components/common/ProfileRow";
import AppHeader from "../components/common/AppHeader";
import EditFieldModal from "../components/common/EditFieldModal";
import { fetchUserProfile, updateUserProfile } from "../redux/slices/userSlice";
import imageUploadService from "../services/imageUploadService";
import { 
  validateName, 
  validateUsername, 
  validatePhoneNumber, 
  sanitizeInput 
} from "../utils/validationUtils";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.user);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdateSuccess, setLastUpdateSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [editModal, setEditModal] = useState({
    visible: false,
    field: null,
    value: "",
  });

  // Handle back button press with unsaved changes warning
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (hasUnsavedChanges) {
        Alert.alert(
          "Unsaved Changes",
          "You have unsaved changes. Are you sure you want to go back?",
          [
            { text: "Stay", style: "cancel" },
            { text: "Leave", style: "destructive", onPress: () => navigation.goBack() }
          ]
        );
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [hasUnsavedChanges, navigation]);

  // Fetch user profile on mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Show error if any
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  // Hide success indicator after 3 seconds
  useEffect(() => {
    if (lastUpdateSuccess) {
      const timer = setTimeout(() => {
        setLastUpdateSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdateSuccess]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchUserProfile()).unwrap();
    } catch (err) {
      Alert.alert("Error", "Failed to refresh profile data");
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const closeEditModal = () => {
    setEditModal({
      visible: false,
      field: null,
      value: "",
    });
    setHasUnsavedChanges(false);
  };

  const handleSaveField = async (field, value) => {
    try {
      // Client-side validation
      let validation = { isValid: true, error: null };
      const sanitizedValue = sanitizeInput(value);

      switch (field) {
        case 'name':
          validation = validateName(sanitizedValue);
          break;
        case 'username':
          validation = validateUsername(sanitizedValue);
          break;
        case 'phone_number':
          validation = validatePhoneNumber(sanitizedValue);
          break;
        default:
          if (!sanitizedValue.trim()) {
            validation = { isValid: false, error: `${field} is required` };
          }
          break;
      }

      if (!validation.isValid) {
        Alert.alert("Validation Error", validation.error);
        throw new Error(validation.error);
      }

      // Check if value has actually changed
      if (profile?.[field] === sanitizedValue) {
        Alert.alert("No Changes", "No changes were made to save");
        closeEditModal();
        return;
      }

      await dispatch(updateUserProfile({ [field]: sanitizedValue })).unwrap();
      setLastUpdateSuccess(true);
      setHasUnsavedChanges(false);
      Alert.alert("Success", `${field === 'phone_number' ? 'Phone number' : field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
      closeEditModal();
    } catch (err) {
      console.error("Save field error:", err);
      const errorMessage = err?.message || err || "Failed to update profile";
      Alert.alert("Update Failed", errorMessage);
      throw err; // Re-throw to let modal handle loading state
    }
  };

  const openEditModal = (field) => {
    // Prevent editing if currently uploading image
    if (uploadingImage) {
      Alert.alert("Please Wait", "Please wait for the image upload to complete");
      return;
    }

    setEditModal({
      visible: true,
      field,
      value: profile?.[field] || "",
    });
    setHasUnsavedChanges(true);
  };

  const handleImagePick = () => {
    if (uploadingImage) {
      Alert.alert("Upload in Progress", "Please wait for the current upload to complete");
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      includeBase64: false,
    };

    Alert.alert(
      "Update Profile Picture",
      "Choose an option",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Choose from Gallery", 
          onPress: () => {
            launchImageLibrary(options, async (response) => {
              if (response.didCancel || response.errorCode) {
                if (response.errorCode) {
                  Alert.alert("Error", response.errorMessage || "Failed to pick image");
                }
                return;
              }

              if (response.assets && response.assets[0]) {
                const imageUri = response.assets[0].uri;
                const fileSize = response.assets[0].fileSize;
                
                // Check file size (limit to 5MB)
                if (fileSize && fileSize > 5 * 1024 * 1024) {
                  Alert.alert("File Too Large", "Please select an image smaller than 5MB");
                  return;
                }

                await uploadProfilePicture(imageUri);
              }
            });
          }
        }
      ]
    );
  };

  const uploadProfilePicture = async (imageUri) => {
    try {
      setUploadingImage(true);

      // Validate image URI
      if (!imageUri) {
        throw new Error("Invalid image selected");
      }

      // Upload to Cloudinary with error handling
      const imageUrl = await imageUploadService.uploadImage(imageUri, 'profile_pictures');
      
      if (!imageUrl) {
        throw new Error("Failed to upload image to server");
      }

      // Update profile with new image URL
      await dispatch(updateUserProfile({ profile_picture: imageUrl })).unwrap();
      setLastUpdateSuccess(true);
      Alert.alert("Success", "Profile picture updated successfully!");

    } catch (err) {
      console.error("Upload error:", err);
      let errorMessage = "Failed to upload image";
      
      if (err.message?.includes("Network")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (err.message?.includes("size")) {
        errorMessage = "Image file is too large. Please select a smaller image.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      Alert.alert("Upload Failed", errorMessage);
    } finally {
      setUploadingImage(false);
    }
  };

  const getProfileCompletionPercentage = () => {
    if (!profile) return 0;
    
    const fields = ['name', 'username', 'email', 'phone_number', 'profile_picture'];
    const completedFields = fields.filter(field => {
      const value = profile[field];
      if (!value) return false;
      
      // Validate the field if it has validation rules
      switch (field) {
        case 'name':
          return validateName(value).isValid;
        case 'username':
          return validateUsername(value).isValid;
        case 'phone_number':
          return validatePhoneNumber(value).isValid;
        case 'email':
          return value && value.includes('@');
        case 'profile_picture':
          return value && value !== "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";
        default:
          return true;
      }
    });
    
    return Math.round((completedFields.length / fields.length) * 100);
  };

  if (loading && !profile) {
    return (
      <View style={styles.container}>
        <AppHeader
          title="Edit Profile"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Edit Profile"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }
      >
        {/* Success Indicator */}
        {lastUpdateSuccess && (
          <View style={styles.successBanner}>
            <CheckCircle size={20} color={COLORS.SUCCESS} />
            <Text style={styles.successText}>Profile updated successfully!</Text>
          </View>
        )}

        {/* Profile Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: profile?.profile_picture || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
              }}
              style={styles.avatar}
              onError={() => {
                console.warn("Profile image failed to load");
              }}
            />
            {uploadingImage && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator size="large" color={COLORS.WHITE} />
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.cameraButton,
              uploadingImage && styles.cameraButtonDisabled
            ]}
            onPress={handleImagePick}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <ActivityIndicator size="small" color={COLORS.WHITE} />
            ) : (
              <Camera size={18} color={COLORS.WHITE} />
            )}
          </TouchableOpacity>
          <Text style={styles.avatarHelperText}>
            Tap camera icon to change picture
          </Text>
        </View>

        {/* Basic Info */}
        <View style={styles.card}>
          <ProfileRow
            label="Name"
            value={profile?.name || "Not set"}
            onPress={() => openEditModal("name")}
            disabled={loading || uploadingImage}
            showValidation={true}
            isValid={profile?.name && validateName(profile.name).isValid}
          />
          <ProfileRow
            label="Username"
            value={profile?.username || "Not set"}
            onPress={() => openEditModal("username")}
            disabled={loading || uploadingImage}
            showValidation={true}
            isValid={profile?.username && validateUsername(profile.username).isValid}
          />
        </View>

        {/* Private Information Title */}
        <Text style={styles.sectionTitle}>Private Information</Text>

        {/* Private Info Card */}
        <View style={styles.card}>
          <ProfileRow
            label="Email"
            value={profile?.email || "Not set"}
            onPress={() => {}}
            disabled
            showInfo="Email cannot be changed"
          />
          <ProfileRow
            label="Phone Number"
            value={profile?.phone_number || "Not set"}
            onPress={() => openEditModal("phone_number")}
            disabled={loading || uploadingImage}
            showValidation={true}
            isValid={profile?.phone_number && validatePhoneNumber(profile.phone_number).isValid}
          />
        </View>

        {/* Profile Completion Indicator */}
        <View style={styles.completionCard}>
          <Text style={styles.completionTitle}>Profile Completion</Text>
          <View style={styles.completionBar}>
            <View 
              style={[
                styles.completionFill, 
                { width: `${getProfileCompletionPercentage()}%` }
              ]} 
            />
          </View>
          <Text style={styles.completionText}>
            {getProfileCompletionPercentage()}% Complete
          </Text>
          {getProfileCompletionPercentage() < 100 && (
            <Text style={styles.completionHint}>
              Complete your profile to get better recommendations
            </Text>
          )}
        </View>

        {/* Security Section */}
        <Text style={styles.sectionTitle}>Security & Privacy</Text>
        <View style={styles.card}>
          <View style={styles.securityRow}>
            <View style={styles.securityLeft}>
              <Shield size={20} color={COLORS.SUCCESS} />
              <View style={styles.securityText}>
                <Text style={styles.securityTitle}>Account Security</Text>
                <Text style={styles.securitySubtitle}>Your account is protected</Text>
              </View>
            </View>
            <View style={styles.securityBadge}>
              <Text style={styles.securityBadgeText}>Verified</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Edit Field Modal */}
      <EditFieldModal
        visible={editModal.visible}
        onClose={closeEditModal}
        field={editModal.field}
        value={editModal.value}
        onSave={handleSaveField}
        loading={loading}
      />
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.GRAY,
  },
  avatarContainer: {
    alignSelf: "center",
    marginBottom: 30,
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 100,
  },
  uploadOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  cameraButtonDisabled: {
    backgroundColor: COLORS.GRAY,
  },
  avatarHelperText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.GRAY,
    textAlign: "center",
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.SUCCESS + "20",
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.SUCCESS,
  },
  successText: {
    marginLeft: 8,
    color: COLORS.SUCCESS,
    fontSize: 14,
    fontWeight: "500",
  },
  card: {
    backgroundColor: COLORS.WHITE,
    padding: 6,
    borderRadius: 12,
    elevation: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: COLORS.GRAY,
    marginBottom: 10,
    fontWeight: "600",
  },
  completionCard: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    marginBottom: 20,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.DARK,
    marginBottom: 12,
  },
  completionBar: {
    height: 8,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  completionFill: {
    height: "100%",
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
  },
  completionText: {
    fontSize: 14,
    color: COLORS.DARK,
    fontWeight: "500",
  },
  completionHint: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: 4,
    fontStyle: "italic",
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  securityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  securityText: {
    marginLeft: 12,
    flex: 1,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.DARK,
  },
  securitySubtitle: {
    fontSize: 13,
    color: COLORS.GRAY,
    marginTop: 2,
  },
  securityBadge: {
    backgroundColor: COLORS.SUCCESS + "20",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  securityBadgeText: {
    fontSize: 12,
    color: COLORS.SUCCESS,
    fontWeight: "600",
  },
});
