import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductItem from "../components/core/search/ProducatItem";
import SearchResultCard from "../components/core/search/SearchResultCard";
import SkeletonCard from "../components/core/search/SkeletonCard";
import { ArrowLeft, Search, X, Clock, Trash2 } from "lucide-react-native";
import useDebounce from "../hooks/useDebounce";
import searchService from "../services/searchService";

const SearchScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);

  // Data for initial view
  const [popularProducts, setPopularProducts] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setInitialLoading(true);
      try {
        const [popularRes, recentRes] = await Promise.all([
          searchService.getPopularItems(10),
          searchService.getRecentSearches(5)
        ]);

        if (popularRes.success) {
          setPopularProducts(popularRes.data?.medicines || []);
        }

        if (recentRes.success) {
          setRecentSearches(recentRes.data?.searches || []);
        }
      } catch (e) {
        console.error("Failed to fetch search screen data", e);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Debounce search term
  const debouncedSearch = useDebounce(search, 500);

  // Perform search when debounced value changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearch.trim().length === 0) {
        setSearchResults([]);
        setIsSearching(false);
        setTotalCount(0);
        setError(null);
        return;
      }

      if (debouncedSearch.trim().length < 2) {
        return; // Don't search for single character
      }

      setIsLoading(true);
      setIsSearching(true);
      setError(null);

      try {
        const response = await searchService.searchMedicines(debouncedSearch, {
          limit: 20,
          offset: 0,
          status: 'Enable',
        });
        console.log("response", response);

        if (response.success) {
          setSearchResults(response.data.medicines || []);
          setTotalCount(response.data.total_count || 0);
        } else {
          setError(response.error || 'Failed to fetch results');
          setSearchResults([]);
          setTotalCount(0);
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('An error occurred while searching');
        setSearchResults([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearch]);

  const handleClearSearch = () => {
    setSearch("");
    setSearchResults([]);
    setIsSearching(false);
    setTotalCount(0);
    setError(null);
  };

  const handlePopularProductPress = (productName) => {
    setSearch(productName);
  };

  const renderSkeletonLoading = () => {
    return (
      <FlatList
        data={[1, 2, 3, 4]}
        horizontal
        keyExtractor={(item) => `skeleton-${item}`}
        contentContainerStyle={{ paddingLeft: 15 }}
        showsHorizontalScrollIndicator={false}
        renderItem={() => <SkeletonCard />}
      />
    );
  };

  const renderSearchResults = () => {
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>⚠️ {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setSearch(search + " ")} // Trigger re-search
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (searchResults.length === 0 && !isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No results found for "{debouncedSearch}"
          </Text>
          <Text style={styles.emptySubText}>
            Try searching with different keywords
          </Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.resultHeader}>
          <Text style={styles.resultCount}>
            {totalCount} {totalCount === 1 ? 'result' : 'results'} found
          </Text>
        </View>
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <SearchResultCard product={item} />}
        />
      </>
    );
  };

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
          <Search color="#9E9E9E" size={20} style={styles.searchIcon} />
          <TextInput
            placeholder='Search for "Pulses"'
            placeholderTextColor="#9E9E9E"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <X color="#9E9E9E" size={20} />
            </TouchableOpacity>
          )}
          {isLoading && (
            <ActivityIndicator size="small" color="#4CAF50" style={styles.loader} />
          )}
        </View>
      </View>

      {/* Search Results or Popular Products */}
      {isSearching ? (
        <View style={styles.searchResultsContainer}>
          {isLoading ? renderSkeletonLoading() : renderSearchResults()}
        </View>
      ) : (
        <View style={styles.initialContent}>
          {initialLoading ? (
            <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />
          ) : (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.title}>Recent Searches</Text>
                  </View>
                  <View style={styles.recentTagsContainer}>
                    {recentSearches.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.recentTag}
                        onPress={() => setSearch(item.query)}
                      >
                        <Clock size={14} color="#666" style={{ marginRight: 6 }} />
                        <Text style={styles.recentTagText}>{item.query}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Popular Products */}
              {popularProducts.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.title}>Popular Products</Text>
                  <FlatList
                    data={popularProducts}
                    horizontal
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingLeft: 15, paddingRight: 15 }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <ProductItem
                        image={item.images?.[0]?.url ? { uri: item.images[0].url } : require("../assets/images/product/milk.png")}
                        name={item.productName}
                        onPress={() => handlePopularProductPress(item.productName)}
                      />
                    )}
                  />
                </View>
              )}
            </>
          )}
        </View>
      )}
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
    marginBottom: 15,
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  searchBox: {
    flex: 1,
    height: 45,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  loader: {
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
    color: "#000",
  },
  searchResultsContainer: {
    flex: 1,
  },
  resultHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#F9F9F9",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  resultCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  resultsContainer: {
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  initialContent: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  recentTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginTop: 5,
  },
  recentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  recentTagText: {
    fontSize: 14,
    color: '#333',
  },
});
