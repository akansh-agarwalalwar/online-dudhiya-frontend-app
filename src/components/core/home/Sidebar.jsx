import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ShoppingCart, User, X, Store, Headphones, LogOut } from "lucide-react-native";

const { width } = Dimensions.get("screen");
const SIDEBAR_WIDTH = width * 0.75;

const Sidebar = ({ visible, onClose }) => {
  const translateX = useSharedValue(-SIDEBAR_WIDTH);

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
            <User size={30} color="#fff" />
          </View>

          <View>
            <Text style={styles.username}>John Doe</Text>
            <Text style={styles.email}>johndoe@gmail.com</Text>
          </View>
        </View>

        {/* CART */}
        <TouchableOpacity style={styles.menuItem}>
          <ShoppingCart size={22} color="#333" />
          <Text style={styles.menuText}>My Cart</Text>
        </TouchableOpacity>

        {/* SHOP BY CATEGORY */}
        <View style={styles.sectionHeader}>
          <Store size={22} color="#333" />
          <Text style={styles.sectionTitle}>Shop by Category</Text>
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.category}>Milk</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.category}>Curd</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.category}>Paneer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.category}>Ghee</Text>
        </TouchableOpacity>

        {/* SUPPORT */}
        <TouchableOpacity style={styles.menuItem}>
          <Headphones size={22} color="#333" />
          <Text style={styles.menuText}>Support</Text>
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.menuItem}>
          <LogOut size={22} color="red" />
          <Text style={[styles.menuText, { color: "red" }]}>Logout</Text>
        </TouchableOpacity>

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
});

export default Sidebar;
