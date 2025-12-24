import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Camera } from "lucide-react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import COLORS from "../constants/Color";
import ProfileRow from "../components/common/ProfileRow";
import AppHeader from "../components/common/AppHeader";
import EditFieldModal from "../components/common/EditFieldModal";
import { fetchUserProfile, updateUserProfile } from "../redux/slices/userSlice";
import imageUploadService from "../services/imageUploadService";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.user);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [editModal, setEditModal] = useState({
    visible: false,
    field: null,
    value: "",
  });

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

  const openEditModal = (field) => {
    setEditModal({
      visible: true,
      field,
      value: profile?.[field] || "",
    });
  };

  const closeEditModal = () => {
    setEditModal({
      visible: false,
      field: null,
      value: "",
    });
  };

  const handleSaveField = async (field, value) => {
    try {
      await dispatch(updateUserProfile({ [field]: value })).unwrap();
      Alert.alert("Success", "Profile updated successfully!");
      closeEditModal();
    } catch (err) {
      Alert.alert("Error", err || "Failed to update profile");
    }
  };

  const handleImagePick = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert("Error", response.errorMessage || "Failed to pick image");
        return;
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        await uploadProfilePicture(imageUri);
      }
    });
  };

  const uploadProfilePicture = async (imageUri) => {
    try {
      setUploadingImage(true);

      // Upload to Cloudinary
      const imageUrl = await imageUploadService.uploadImage(imageUri, 'profile_pictures');

      // Update profile with new image URL
      await dispatch(updateUserProfile({ profile_picture: imageUrl })).unwrap();

      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error", err.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: profile?.profile_picture || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
            }}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleImagePick}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <ActivityIndicator size="small" color={COLORS.WHITE} />
            ) : (
              <Camera size={18} color={COLORS.WHITE} />
            )}
          </TouchableOpacity>
        </View>

        {/* Basic Info */}
        <View style={styles.card}>
          <ProfileRow
            label="Name"
            value={profile?.name || "Not set"}
            onPress={() => openEditModal("name")}
          />
          <ProfileRow
            label="Username"
            value={profile?.username || "Not set"}
            onPress={() => openEditModal("username")}
          />
        </View>

        {/* Private Information Title */}
        <Text style={styles.sectionTitle}>Private Information</Text>

        {/* Private Info Card */}
        <View style={styles.card}>
          <ProfileRow
            label="Email"
            value={profile?.email || "Not set"}
            onPress={() => { }}
            disabled
          />
          <ProfileRow
            label="Phone Number"
            value={profile?.phone_number || "Not set"}
            onPress={() => openEditModal("phone_number")}
          />
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
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 100,
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
});
