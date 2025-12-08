import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductItem from "../components/core/search/ProducatItem";
import {  ArrowLeft } from "lucide-react-native";

const POPULAR_PRODUCTS = [
  { id: "1", name: "Apple", image: require("../assets/images/product/milk.png") },
  { id: "2", name: "Milk", image: require("../assets/images/product/milk.png") },
  { id: "3", name: "Vegetable", image: require("../assets/images/product/milk.png") },
  { id: "4", name: "Ghee", image: require("../assets/images/product/milk.png") },
  { id: "5", name: "Oil", image: require("../assets/images/product/milk.png") },
];

const SearchScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 🔙 Back + Search Input */}
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft
            color="#000"
            size={24}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <TextInput
            placeholder='Search for "Pulses"'
            placeholderTextColor="#9E9E9E"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Popular Products */}
      <Text style={styles.title}>Popular Products</Text>

      <FlatList
        data={POPULAR_PRODUCTS}
        horizontal
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingLeft: 15 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductItem
            image={item.image}
            name={item.name}
            onPress={() => console.log("Selected:", item.name)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#000",
    marginRight: 10,
  },
  searchBox: {
    flex: 1,
    height: 45,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  input: {
    fontSize: 16,
    color: "#000",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 15,
    marginTop: 20,
    color: "#000",
  },
});
