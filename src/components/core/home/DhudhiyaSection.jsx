import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient"; // Make sure to install this package

const DhudhiyaSection = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#ffffffff", "#f5f5f5ff"]}
        style={styles.titleWrapper}
      >
        <Text style={styles.title}>Online {'\n'}<Text style={{color: "#bb9ffe4c"}}>Dhudhiya</Text></Text>
              <Text style={styles.subtitle}>
        From Farm To Direct To Your Home
      </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleWrapper: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: "100%",
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 48,
    color: "#9fd6fe84",
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: "500",
    color: "gray",
  },
});

export default DhudhiyaSection;
