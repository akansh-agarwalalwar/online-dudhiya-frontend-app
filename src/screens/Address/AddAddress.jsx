import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import InputField from "../../components/common/InputField";
import { MapPin } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import COLORS from "../../constants/Color";
import AppHeader from "../../components/common/AppHeader";
import { createAddress, updateAddress } from "../../redux/slices/userSlice";

const AddAddressScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const editAddress = route?.params?.address;
  const isEditing = !!editAddress;

  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    address_line_1: "",
    address_line_2: "",
    city_district: "",
    state: "",
    pincode: "",
    is_default: false,
  });

  useEffect(() => {
    if (editAddress) {
      setForm({
        name: editAddress.name || "",
        phone_number: editAddress.phone_number || "",
        address_line_1: editAddress.address_line_1 || "",
        address_line_2: editAddress.address_line_2 || "",
        city_district: editAddress.city_district || "",
        state: editAddress.state || "",
        pincode: editAddress.pincode || "",
        is_default: editAddress.is_default || false,
      });
    }
  }, [editAddress]);

  const updateForm = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "Please enter name");
      return false;
    }
    if (!form.phone_number.trim() || !/^[0-9]{10}$/.test(form.phone_number)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return false;
    }
    if (!form.address_line_1.trim()) {
      Alert.alert("Error", "Please enter address line 1");
      return false;
    }
    if (!form.city_district.trim()) {
      Alert.alert("Error", "Please enter city/district");
      return false;
    }
    if (!form.state.trim()) {
      Alert.alert("Error", "Please enter state");
      return false;
    }
    if (!form.pincode.trim() || !/^[0-9]{6}$/.test(form.pincode)) {
      Alert.alert("Error", "Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing) {
        await dispatch(updateAddress({
          addressId: editAddress.id,
          addressData: form
        })).unwrap();
        Alert.alert("Success", "Address updated successfully");
      } else {
        await dispatch(createAddress(form)).unwrap();
        Alert.alert("Success", "Address created successfully");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Save address error:", error);
      Alert.alert("Error", error || "Failed to save address");
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title={isEditing ? "Edit Address" : "Add Address"}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        {/* Current Location */}
        <View style={styles.locationBox}>
          <MapPin size={20} color={COLORS.PRIMARY} />
          <Text style={styles.locationText}>Current Location</Text>
        </View>

        <InputField
          label="Name"
          placeholder="John Doe"
          value={form.name}
          onChangeText={(v) => updateForm("name", v)}
        />

        <InputField
          label="Phone Number"
          placeholder="9876543210"
          value={form.phone_number}
          onChangeText={(v) => updateForm("phone_number", v)}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <InputField
          label="Address Line 1"
          placeholder="123 Main Street, Downtown"
          value={form.address_line_1}
          onChangeText={(v) => updateForm("address_line_1", v)}
        />

        <InputField
          label="Address Line 2 (Optional)"
          placeholder="789 Plaza, Floor 15"
          value={form.address_line_2}
          onChangeText={(v) => updateForm("address_line_2", v)}
        />

        <InputField
          label="City/District"
          placeholder="Brooklyn"
          value={form.city_district}
          onChangeText={(v) => updateForm("city_district", v)}
        />

        <InputField
          label="State"
          placeholder="New York"
          value={form.state}
          onChangeText={(v) => updateForm("state", v)}
        />

        <InputField
          label="Pincode"
          placeholder="110001"
          value={form.pincode}
          onChangeText={(v) => updateForm("pincode", v)}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.WHITE} />
          ) : (
            <Text style={styles.saveText}>
              {isEditing ? "Update Address" : "Save & Continue"}
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  backButton: {
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.DARK,
    marginBottom: 20,
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 12,
    marginBottom: 20,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.DARK,
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: COLORS.ACCENT_GREEN,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: "700",
  },
});
