import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import InputField from "../../components/common/InputField";
import { ChevronLeft, MapPin } from "lucide-react-native";
import COLORS from "../../constants/Color";
import AppHeader from "../../components/common/AppHeader";

const AddAddressScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    country: "",
    address1: "",
    address2: "",
    city: "",
    village: "",
    state: "",
    zip: "",
  });

  const updateForm = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <View style={styles.container}>
        <AppHeader
          title="Add Address"
            showBackButton
            onBackPress={() => navigation.goBack()}
        />
      <ScrollView style={{ flex: 1,padding: 20 }} showsVerticalScrollIndicator={false}>
        {/* Current Location */}
        <View style={styles.locationBox}>
          <MapPin size={20} color={COLORS.PRIMARY} />
          <Text style={styles.locationText}>Current Location</Text>
        </View>

        <InputField
          label="Country"
          placeholder="USA"
          value={form.country}
          onChangeText={(v) => updateForm("country", v)}
        />

        <InputField
          label="Address Line 1"
          placeholder="123 Main Street, Downtown"
          value={form.address1}
          onChangeText={(v) => updateForm("address1", v)}
        />

        <InputField
          label="Address Line 2 (Optional)"
          placeholder="789 Plaza, Floor 15"
          value={form.address2}
          onChangeText={(v) => updateForm("address2", v)}
        />

        <InputField
          label="City"
          placeholder="Brooklyn, NY 11201"
          value={form.city}
          onChangeText={(v) => updateForm("city", v)}
        />

        <InputField
          label="Village"
          placeholder="House #5"
          value={form.village}
          onChangeText={(v) => updateForm("village", v)}
        />

        <InputField
          label="State"
          placeholder="Manhattan, NY 10016"
          value={form.state}
          onChangeText={(v) => updateForm("state", v)}
        />

        <InputField
          label="Zip Code"
          placeholder="9440"
          value={form.zip}
          onChangeText={(v) => updateForm("zip", v)}
        />

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save & Continue</Text>
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
  saveText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: "700",
  },
});
