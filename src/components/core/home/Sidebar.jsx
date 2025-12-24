import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, ActivityIndicator, Alert } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ShoppingCart, User, X, Store, Headphones, LogOut, Info } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../redux/thunks/categoryThunk";
import { selectCategories, selectCategoriesLoading } from "../../../redux/slices/categorySlice";
import { logout } from "../../../redux/slices/authSlice";
import authService from "../../../services/authService";

const { width } = Dimensions.get("screen");
const SIDEBAR_WIDTH = width * 0.75;

const Sidebar = ({ visible, onClose, profile }) => {
  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Get categories from Redux store
  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const isGuest = useSelector(state => state.auth.isGuest);

  const handleCartPress = () => {
    handleClose();
    if (isGuest) {
      Alert.alert(
        "Login Required",
        "Please login to access your cart.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Login",
            onPress: () => {
              dispatch(logout());
              navigation.navigate("Login");
            }
          }
        ]
      );
    } else {
      navigation.navigate('Cart');
    }
  };

  // Fetch categories when sidebar becomes visible
  useEffect(() => {
    if (visible && categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [visible, dispatch, categories.length]);

  useEffect(() => {
    translateX.value = visible
      ? withTiming(0, { duration: 350 })
      : withTiming(-SIDEBAR_WIDTH, { duration: 350 });
  }, [visible]);

  const handleClose = () => {
    console.log('Sidebar close button pressed');
    if (onClose) {
      onClose();
    }
  };

  // Handle category click - navigate to Product page with category filter
  const handleCategoryPress = (category) => {
    console.log('Category pressed:', category);
    // Close sidebar first
    handleClose();
    // Navigate to Products tab with category filter
    navigation.navigate('Products', {
      categoryId: category.id,
      categorySlug: category.slug,
      categoryName: category.name || category.title
    });
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            handleClose();
            try {
              await authService.logout();
              dispatch(logout());
            } catch (error) {
              console.error("Logout error:", error);
              dispatch(logout());
            }
          }
        }
      ]
    );
  };

  const sidebarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <>
      {visible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose} />
      )}

      <Animated.View style={[styles.sidebar, sidebarStyle]}>

        {/* CLOSE BUTTON */}
        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
          <X size={26} color="#333" />
        </TouchableOpacity>

        {/* USER INFO */}
        <View style={styles.userSection}>
          <View style={styles.userIcon}>
            {profile?.profile_picture ? (
              <Image
                source={{ uri: profile?.profile_picture }}
                style={styles.userImage}
              />
            ) : (
              <User size={30} color="#fff" />
            )}
          </View>

          <View>
            <Text style={styles.username}>{profile?.name || 'Guest User'}</Text>
            <Text style={styles.email}>{profile?.phone_number ? '+91 ' + profile.phone_number : '+91 xxxxx xxxxx'}</Text>
          </View>
        </View>

        {/* CART */}

        <TouchableOpacity
          onPress={handleCartPress}
          style={styles.menuItem}
        >
          <ShoppingCart size={22} color="#333" />
          <Text style={styles.menuText}>My Cart</Text>
        </TouchableOpacity>

        {/* SHOP BY CATEGORY */}
        <View style={styles.sectionHeader}>
          <Store size={22} color="#333" />
          <Text style={styles.sectionTitle}>Shop by Category</Text>
        </View>

        {/* Categories Loading State */}
        {categoriesLoading && categories.length === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4A90E2" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        )}

        {/* Categories List */}
        {!categoriesLoading && categories.length > 0 && (
          <ScrollView style={styles.categoriesScroll} showsVerticalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.menuItem}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={styles.category}>{category.name || category.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* No Categories State */}
        {!categoriesLoading && categories.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories available</Text>
          </View>
        )}

        {/* SUPPORT */}

        <TouchableOpacity style={styles.menuItem} onPress={() => { handleClose(); navigation.navigate('HelpAndSupport'); }}>
          <Headphones size={22} color="#333" />
          <Text style={styles.menuText}>Support</Text>
        </TouchableOpacity>

        {/* ABOUT */}
        <TouchableOpacity style={styles.menuItem} onPress={() => { handleClose(); navigation.navigate('About'); }}>
          <Info size={22} color="#333" />
          <Text style={styles.menuText}>About Us</Text>
        </TouchableOpacity>

        {/* LOGOUT */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={[styles.menuItem, styles.logoutBtn]} onPress={handleLogout}>
            <LogOut size={22} color="red" />
            <Text style={[styles.menuText, { color: "red" }]}>Logout</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 9998,
    elevation: 15,
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
    elevation: 20,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  userImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 8,
    zIndex: 10000,
    backgroundColor: 'transparent',
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  userIcon: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  username: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 13,
    color: "gray",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 15,
    marginLeft: 10,
    color: "#333",
  },

  category: {
    fontSize: 15,
    marginLeft: 32,
    color: "#555",
  },

  logoutContainer: {
    position: 'absolute',
    backgroundColor: '#fbfbfbff',
    bottom: 0,
    width: SIDEBAR_WIDTH,
    left: 0,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutBtn: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#ffc0c0ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Loading state
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
  },

  // Categories scroll
  categoriesScroll: {
    maxHeight: 200,
  },

  // Empty state
  emptyContainer: {
    paddingVertical: 15,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 13,
    color: "#999",
    fontStyle: "italic",
  },
});

export default Sidebar;
