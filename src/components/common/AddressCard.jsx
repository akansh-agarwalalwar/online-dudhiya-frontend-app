import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "../../constants/Color";
import { MapPin, MoreVertical } from "lucide-react-native";

const AddressCard = ({ data, onEdit, onDelete, onSetDefault }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <MapPin size={22} color={COLORS.PRIMARY} />

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.title}>{data.label}</Text>
          <Text style={styles.address}>{data.address}</Text>

          {data.isDefault && (
            <Text style={styles.default}>Default</Text>
          )}
                <View style={styles.footer}>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>

        {!data.isDefault && (
          <TouchableOpacity onPress={onSetDefault}>
            <Text style={styles.defaultButton}>Set as default</Text>
          </TouchableOpacity>
        )}
      </View>
        </View>

        <TouchableOpacity>
          <MoreVertical size={20} color={COLORS.GRAY} />
        </TouchableOpacity>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.DARK,
  },
  address: {
    marginTop: 2,
    color: COLORS.GRAY,
    fontSize: 13,
  },
  footer: {
    flexDirection: "row",
    marginTop: 12,
    gap: 20,
  },
  edit: {
    color: COLORS.GRAY,
    fontSize: 14,
    fontWeight: "400",
  },
  delete: {
    color: COLORS.GRAY,
    fontSize: 14,
    fontWeight: "400",
  },
  default: {
    marginTop: 4,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    color: COLORS.GRAY,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
    borderRadius: 8,
  },
  defaultButton: {
    color: COLORS.GRAY,
    fontSize: 14,
    fontWeight: "400",
  },
});

export default AddressCard;
