import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import CategoryCard from "./CategoryCard";
import COLORS from "../../../constants/Color";
const categories = [
  {
    id: 1,
    title: "Milk",
    image: 'https://static.vecteezy.com/system/resources/previews/050/038/277/non_2x/milk-bottle-made-of-glass-isolated-in-transparent-background-free-png.png',
    bg: "#E8F6FF",
  },
  {
    id: 2,
    title: "Curd",
    image:"https://brindhavangaushala.com/wp-content/uploads/2020/12/curd.png",
    bg: "#E6FFE9",
  },
  {
    id: 3,
    title: "Bread",
    image:"https://static.vecteezy.com/system/resources/previews/047/084/338/non_2x/white-bread-slice-on-transparent-background-free-png.png",
    bg: "#FFF8D9",
  },
  {
    id: 4,
    title: "Paneer",
    image:"https://static.vecteezy.com/system/resources/previews/059/374/311/non_2x/raw-paneer-cheese-with-slices-cut-off-isolated-on-transparent-background-free-png.png",
    bg: "#FFECEC",
  },
];

const CategoryList = ({ onSelect }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Shop By Category</Text>

        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        contentContainerStyle={{ paddingHorizontal: 10 ,marginTop:40,paddingBottom: 10,overflow:'visible'}}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
              <CategoryCard item={item} onPress={onSelect} />
        )}
      />
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  seeAll: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.PRIMARY,
  },
});
