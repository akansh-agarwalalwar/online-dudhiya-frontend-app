import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
} from "react-native";
import COLORS from "../../constants/Color";
import { Search, ArrowRight } from "lucide-react-native";

const SearchBar = ({
  suggestions = ["Bread", "Milk", "Curd"],
  onSearch = () => {},
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      slideAnimation();
    }, 2000);

    return () => clearInterval(interval);
  }, [index]);

  const slideAnimation = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: -20,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 20,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIndex((prev) => (prev + 1) % suggestions.length);
    });
  };

  return (
    <TouchableOpacity onPress={onSearch} style={styles.container}>
      <Search size={20} color={COLORS.PRIMARY} />

      <View style={styles.animatedPlaceholderContainer}>
        <Text style={styles.animatedPlaceholder}>Search Now </Text>
        <Animated.Text
          style={[
            styles.animatedPlaceholder,
            { transform: [{ translateY: animatedValue }] },
          ]}
        >
          {suggestions[index]}{'....'}
        </Animated.Text>
      </View>

      <ArrowRight size={20} color={COLORS.PRIMARY} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: COLORS.WHITE,
    borderRadius: 22,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    marginTop: 12,
  },

  animatedPlaceholderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    paddingHorizontal: 10,
  },

  animatedPlaceholder: {
    fontSize: 15,
    color: COLORS.GRAY,
  },
});

export default SearchBar;
