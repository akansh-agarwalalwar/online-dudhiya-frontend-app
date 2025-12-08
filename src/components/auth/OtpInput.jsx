import React, { useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const OTPInput = ({ code, setCode, maximumLength = 6 }) => {
  const inputRef = useRef(null);

  const handlePress = () => {
    inputRef.current.focus();
  };

  const renderBoxes = () => {
    const digits = code.split("");
    const boxes = [];

    for (let i = 0; i < maximumLength; i++) {
      const digit = digits[i] || "";

      boxes.push(
        <View
          key={i}
          style={[
            styles.box,
            digit ? styles.boxFilled : styles.boxEmpty,
          ]}
        >
          <TextInput
            style={styles.text}
            value={digit}
            maxLength={1}
            editable={false}
          />
        </View>
      );
    }

    return boxes;
  };

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={styles.container} onTouchStart={handlePress}>
        {renderBoxes()}
      </View>

      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={code}
        onChangeText={(val) => {
          if (val.length <= maximumLength) setCode(val);
        }}
        keyboardType="number-pad"
        returnKeyType="done"
      />
    </View>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  box: {
    width: 50,
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  boxEmpty: {
    borderWidth: 1.5,
    borderColor: "#A0AEC0",
  },
  boxFilled: {
    borderWidth: 2,
    borderColor: "#2F5795",
  },
  text: {
    fontSize: 22,
    fontWeight: "700",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
  },
});
