import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Polygon } from "react-native-svg";

const Sizebadge = ({
  size = 90,
  text = "1 Unit",
  bgColor = "#E53935",
  textColor = "#fff",
  style,
}) => {
  const points = `
    50,0   60,12   75,5   78,20   95,22   85,35
    100,50 85,60   95,75  78,78   75,95   60,88
    50,100 40,88   25,95  22,78   5,75   15,60
    0,50   15,35   5,22   22,20   25,5   40,12
  `;
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Polygon points={points} fill={bgColor} />
      </Svg>

      <Text style={[styles.text, { color: textColor, fontSize: size * 0.25 }]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    position: "absolute",
    fontWeight: "bold",
  },
});

export default Sizebadge;
