import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "../../constants/Color";
import { ArrowRight, CheckCircle, AlertCircle, Info } from "lucide-react-native";

const ProfileRow = ({ 
  label, 
  value, 
  onPress, 
  disabled = false, 
  showValidation = false,
  isValid = true,
  showInfo = null
}) => {
  const getValidationIcon = () => {
    if (!showValidation) return null;
    
    if (value === "Not set") {
      return <AlertCircle size={16} color={COLORS.WARNING} />;
    }
    
    return isValid ? 
      <CheckCircle size={16} color={COLORS.SUCCESS} /> : 
      <AlertCircle size={16} color={COLORS.ERROR} />;
  };

  const getInfoIcon = () => {
    if (!showInfo) return null;
    return <Info size={16} color={COLORS.GRAY} />;
  };

  return (
    <TouchableOpacity
      style={[styles.row, disabled && styles.disabledRow]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.leftSide}>
        <Text style={styles.label}>{label}</Text>
        {showInfo && (
          <Text style={styles.infoText}>{showInfo}</Text>
        )}
      </View>
      <View style={styles.rightSide}>
        <Text style={[
          styles.value,
          value === "Not set" && styles.notSetValue
        ]}>
          {value}
        </Text>
        {getValidationIcon()}
        {getInfoIcon()}
        {!disabled && <ArrowRight size={20} color={COLORS.GRAY} />}
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
  disabledRow: {
    opacity: 0.6,
  },
  leftSide: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    color: COLORS.DARK,
    fontWeight: "500",
  },
  infoText: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: 2,
    fontStyle: "italic",
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
  notSetValue: {
    color: COLORS.WARNING,
    fontStyle: "italic",
  },
});
