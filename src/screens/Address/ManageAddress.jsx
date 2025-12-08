import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ChevronLeft, Plus } from "lucide-react-native";
import COLORS from "../../constants/Color";
import AddressCard from "../../components/common/AddressCard";
import AppHeader from "../../components/common/AppHeader";

const ManageAddressScreen = ({ navigation }) => {
  const addresses = [
    {
      id: 1,
      label: "Current Location",
      address: "123 Main Street, Downtown\nNew York, NY 10001",
      isDefault: true,
    },
    {
      id: 2,
      label: "Home",
      address: "456 Oak Avenue, Apt 2B\nBrooklyn, NY 11201",
      isDefault: false,
    },
    {
      id: 3,
      label: "Work",
      address: "123 Main Street, Downtown\nManhattan, NY 10016",
      isDefault: false,
    },
  ];

  return (
    <View style={styles.container}>
        <AppHeader
          title="Manage Address"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
      <ScrollView style={{ flex: 1,padding: 20 }} showsVerticalScrollIndicator={false}>

        {addresses.map((item) => (
          <AddressCard
            key={item.id}
            data={item}
            onEdit={() => {}}
            onDelete={() => {}}
            onSetDefault={() => {}}
          />
        ))}

        {/* Add New Address */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate("AddAddress")}
        >
          <Plus size={22} color={COLORS.PRIMARY} />
          <Text style={styles.addText}>Add New Address</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default ManageAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: COLORS.WHITE,
  },


  addBtn: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_LIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
});
