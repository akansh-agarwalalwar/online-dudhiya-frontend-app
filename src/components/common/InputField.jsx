import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import COLORS from "../../constants/Color";
const InputField = ({ label, placeholder, value, onChangeText, editable = true }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[styles.input, !editable && styles.disabled]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.GRAY}
        value={value}
        editable={editable}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.DARK,
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
  },
  disabled: {
    backgroundColor: COLORS.LIGHT_GRAY,
  },
});

export default InputField;
