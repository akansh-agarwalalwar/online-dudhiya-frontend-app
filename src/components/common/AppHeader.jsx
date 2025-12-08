import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, Filter } from 'lucide-react-native'; // Correct import

const AppHeader = ({
  title = "Header",
  showBack = true,
  showFilter = false,
  onBackPress = () => {},
  onFilterPress = () => {},
  containerStyle = {}
}) => {
  return (
    <View style={[styles.headerContainer, containerStyle]}>

      {/* Back Button */}
      {showBack ? (
        <TouchableOpacity style={styles.leftIcon} onPress={onBackPress}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
      ) : (
        <View style={styles.leftIcon} />
      )}

      {/* Title */}
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>

      {/* Filter Button */}
      {showFilter ? (
        <TouchableOpacity style={styles.rightIcon} onPress={onFilterPress}>
          <Filter size={24} color="#000" />
        </TouchableOpacity>
      ) : (
        <View style={styles.rightIcon} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: "#000",
    paddingTop: 48,
    marginBottom:12,
    paddingBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftIcon: {
    width: 30,
    alignItems: 'flex-start',
  },
  rightIcon: {
    width: 30,
    alignItems: 'flex-end',
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
});

export default AppHeader;
