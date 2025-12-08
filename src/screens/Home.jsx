import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, FlatList, ActivityIndicator } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import Header from "../components/core/home/Header";
import ImageCarousel from "../components/common/ImageCarousel";
import ProductCard from "../components/core/product/ProductCard";
import CategoryList from "../components/core/home/CategoryList";
import ScreenWrapper from "../components/common/ScreenWrapper";
import { fetchHomeSections } from "../redux/thunks/productThunk";
import Section from "../components/core/home/Section";
import DhudhiyaSection from "../components/core/home/DhudhiyaSection";
import Sidebar from "../components/core/home/Sidebar";
 const images = [
    require('../assets/images/Banner/Banner1.png'),
    require('../assets/images/Banner/Banner2.png'),
    require('../assets/images/Banner/Banner3.png'),
    require('../assets/images/Banner/Banner4.png'),
  ];
export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { sections, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchHomeSections());
  }, [dispatch]);

  // Sidebar state
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Header animation state
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('up');

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSearchPress = () => {
    navigation.navigate('SearchScreen');
  };

  const handleSelectCategory = (cat) => {
    console.log("Selected Category:", cat);
  };

  const openSidebar = () => {
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    console.log('Closing sidebar');
    setSidebarVisible(false);
  };

  // Handle swipe gesture to open sidebar
  const onHandlerStateChange = (event) => {
    const { state, translationX, absoluteX } = event.nativeEvent;
    
    if (state === State.END) {
      // Check if gesture started from left edge (within 50px from left) and moved right significantly
      if (absoluteX < 50 && translationX > 80 && !sidebarVisible) {
        openSidebar();
      }
    }
  };

  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDifference = currentScrollY - lastScrollY.current;
    
    // Determine scroll direction
    if (scrollDifference > 5 && scrollDirection.current !== 'down') {
      // Scrolling down - hide header
      scrollDirection.current = 'down';
      if (isHeaderVisible) {
        setIsHeaderVisible(false);
        Animated.timing(headerTranslateY, {
          toValue: -150, 
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } else if (scrollDifference < -5 && scrollDirection.current !== 'up') {
      // Scrolling up - show header
      scrollDirection.current = 'up';
      if (!isHeaderVisible) {
        setIsHeaderVisible(true);
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
    
    lastScrollY.current = currentScrollY;
  };

  return (
    <ScreenWrapper topSafeArea={false} bottomSafeArea={false} style={styles.container}>
      {/* Fixed Header */}
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            transform: [{ translateY: headerTranslateY }],
          }
        ]}
      >
        <Header
          title="Online Dhudhiya"
          onMenuPress={openSidebar}
          onCartPress={() => console.log("Cart opened")}
          cartCount={3}
          handleSearchPress={handleSearchPress}
        />
      </Animated.View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        decelerationRate={0.8} // Use a numeric value for smooth, slow scroll
        bounces={true}
      >
        {/* Content starts with some top padding to account for fixed header */}
        <View style={styles.contentContainer}>   
          <ImageCarousel
            data={images}
            height={200}
            onPressItem={(img) => console.log("Clicked:", img)}
          />
          
          <CategoryList onSelect={handleSelectCategory} />

          {/* Loading State */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1ea6ff" />
              <Text style={styles.loadingText}>Loading products...</Text>
            </View>
          )}

          {/* Error State */}
          {error && !loading && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load products</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => dispatch(fetchHomeSections())}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Sections List */}
          {!loading && !error && sections && sections.length > 0 && (
            <FlatList
              data={sections}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <Section section={item} />}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* No Data State */}
          {!loading && !error && (!sections || sections.length === 0) && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products available</Text>
            </View>
          )}

        </View>
        <DhudhiyaSection />
      </ScrollView>

      {/* Left Edge Gesture Zone for Sidebar - Only active when sidebar is closed */}
      {!sidebarVisible && (
        <PanGestureHandler
          onHandlerStateChange={onHandlerStateChange}
          activeOffsetX={10}
          minPointers={1}
          maxPointers={1}
        >
          <View style={styles.gestureZone} />
        </PanGestureHandler>
      )}
      
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} />

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingTop: 150, // Adjust this based on your header height
    paddingBottom: 30,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1ea6ff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#1ea6ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontWeight: '500',
  },
  gestureZone: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 20,
    height: '100%',
    backgroundColor: 'transparent',
    zIndex: 1500,
  },
});