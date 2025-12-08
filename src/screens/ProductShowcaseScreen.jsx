import React, { useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  ScrollView
} from "react-native";
import ProductCard from "../components/core/product/ProductCard";
import ProductCardPage from "../components/core/product/ProductCardPage";
import EnhancedProductCard from "../components/core/product/EnhancedProductCard";
import { products } from "../config/Produts.json";

const ProductShowcaseScreen = () => {
  const [viewType, setViewType] = useState('grid'); // 'grid', 'list', 'enhanced'
  const allProducts = products;

  // Filter products by category for better organization
  const categories = [...new Set(allProducts.map(p => p.category))];
  
  const renderGridProduct = ({ item }) => (
    <View style={styles.gridItemWrapper}>
      <ProductCard product={item} />
    </View>
  );

  const renderListProduct = ({ item }) => (
    <ProductCardPage product={item} />
  );

  const renderEnhancedProduct = ({ item }) => (
    <View style={styles.gridItemWrapper}>
      <EnhancedProductCard product={item} />
    </View>
  );

  const renderCategorySection = (category) => {
    const categoryProducts = allProducts.filter(p => p.category === category);
    
    return (
      <View key={category} style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <Text style={styles.categoryCount}>{categoryProducts.length} products</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.horizontalList}>
            {categoryProducts.map((product) => (
              <View key={product.id} style={styles.horizontalItem}>
                {viewType === 'enhanced' ? (
                  <EnhancedProductCard product={product} />
                ) : (
                  <ProductCard product={product} />
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Online Dhudhiya</Text>
        <Text style={styles.subtitle}>Fresh Products Delivered Daily</Text>
        <Text style={styles.countText}>
          {allProducts.length} Products • {categories.length} Categories
        </Text>
      </View>

      {/* View Type Selector */}
      <View style={styles.viewSelector}>
        <TouchableOpacity 
          style={[styles.selectorBtn, viewType === 'grid' && styles.activeSelectorBtn]}
          onPress={() => setViewType('grid')}
        >
          <Text style={[styles.selectorText, viewType === 'grid' && styles.activeSelectorText]}>
            Grid View
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.selectorBtn, viewType === 'list' && styles.activeSelectorBtn]}
          onPress={() => setViewType('list')}
        >
          <Text style={[styles.selectorText, viewType === 'list' && styles.activeSelectorText]}>
            List View
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.selectorBtn, viewType === 'enhanced' && styles.activeSelectorBtn]}
          onPress={() => setViewType('enhanced')}
        >
          <Text style={[styles.selectorText, viewType === 'enhanced' && styles.activeSelectorText]}>
            Enhanced
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {viewType === 'list' ? (
        <FlatList
          data={allProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderListProduct}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : viewType === 'grid' ? (
        <FlatList
          data={allProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderGridProduct}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
        />
      ) : viewType === 'enhanced' ? (
        <FlatList
          data={allProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEnhancedProduct}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
        />
      ) : (
        <ScrollView style={styles.categoryContainer}>
          {categories.map(renderCategorySection)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F5F7" 
  },
  
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#EC4A56",
    textAlign: "center",
  },
  
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 2,
  },
  
  countText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
  },
  
  viewSelector: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "space-around",
  },
  
  selectorBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  
  activeSelectorBtn: {
    backgroundColor: "#EC4A56",
  },
  
  selectorText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  
  activeSelectorText: {
    color: "#fff",
  },
  
  listContainer: { 
    paddingBottom: 100,
  },
  
  gridContainer: { 
    paddingBottom: 100,
    paddingHorizontal: 5,
  },
  
  gridItemWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  
  categoryContainer: {
    flex: 1,
  },
  
  categorySection: {
    marginBottom: 25,
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 12,
    padding: 15,
  },
  
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  
  categoryCount: {
    fontSize: 12,
    color: "#666",
    marginBottom: 15,
  },
  
  horizontalList: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  
  horizontalItem: {
    marginRight: 10,
  },
});

export default ProductShowcaseScreen;