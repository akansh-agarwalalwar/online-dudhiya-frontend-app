import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Plus } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import COLORS from "../../constants/Color";
import AddressCard from "../../components/common/AddressCard";
import AppHeader from "../../components/common/AppHeader";
import { fetchAddresses, deleteAddress, setDefaultAddress } from "../../redux/slices/userSlice";

const ManageAddressScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    // Fetch addresses when component mounts
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleEdit = (address) => {
    navigation.navigate("AddAddress", { address });
  };

  const handleDelete = async (addressId) => {
    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      // Optionally show success message
    } catch (error) {
      console.error("Delete address error:", error);
      // Optionally show error message
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await dispatch(setDefaultAddress(addressId)).unwrap();
      // Optionally show success message
    } catch (error) {
      console.error("Set default address error:", error);
      // Optionally show error message
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Manage Address"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>

        {loading && addresses.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          </View>
        ) : addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No addresses found</Text>
            <Text style={styles.emptySubText}>Add your first address to get started</Text>
          </View>
        ) : (
          addresses.map((item) => (
            <AddressCard
              key={item.id}
              data={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item.id)}
              onSetDefault={() => handleSetDefault(item.id)}
            />
          ))
        )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.DARK,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.GRAY,
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
