import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "../../constants/Color";
import { ArrowRight } from "lucide-react-native";

const ProfileRow = ({ label, value, onPress }) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.rightSide}>
        <Text style={styles.value}>{value}</Text>
        <ArrowRight size={20} color={COLORS.GRAY} />
      </View>
    </TouchableOpacity>
  );
};

export default ProfileRow;

const styles = StyleSheet.create({
  row: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: COLORS.DARK,
    fontWeight: "500",
  },
  rightSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  value: {
    fontSize: 15,
    color: COLORS.GRAY,
  },
});
