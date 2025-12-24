import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import COLORS from "../../../constants/Color";
import { ChevronDown, ShoppingBag, Menu, Handbag } from "lucide-react-native";
import SearchBar from "../../common/SearchBar";

const Header = ({
  location = "Wells Building, 2nd Floor",
  eta = "10 mins",
  cartCount = 1,
  onLocationPress = () => {},
  onMenuPress = () => {},
  onCartPress = () => {},
  handleSearchPress = () => {},
}) => {
  return (
    <View style={styles.Subcontainer}>
    <View style={styles.container}>
      
      {/* LEFT SECTION → Menu + Delivery Location */}
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <Menu size={24} color={COLORS.BLACK} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onLocationPress} style={styles.locationContainer}>
          <Text style={styles.deliveryLabel}>Delivery at</Text>
          <View style={styles.row}>
            <Text style={styles.locationText}>{location}</Text>
            <ChevronDown size={18} color={COLORS.BLACK} />
          </View>
        </TouchableOpacity>
      </View>

      {/* RIGHT SECTION → ETA */}
      <View style={styles.etaContainer}>
        {/* Right: Cart */}
        <TouchableOpacity onPress={onCartPress} style={styles.cartContainer}>
          <Handbag size={28} strokeWidth={1.6} color={COLORS.BLACK} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        {/* <Text style={styles.etaLabel}>Just in</Text>
        <View style={styles.etaBadge}>
          <Text style={styles.etaText}>{eta}</Text>
        </View> */}
      </View>

    </View>
                    <SearchBar
            suggestions={["Bread", "Milk", "Curd", "Butter", "Cheese"]}
            onSearch={handleSearchPress}
          />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  Subcontainer: {
    width: "100%",
    backgroundColor: COLORS.WHITE,
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  container: {
    width: "100%",
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // LEFT SECTION
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuButton: {
    marginRight: 12,
    padding: 4,
  },
  locationContainer: {
    flexDirection: "column",
    flex: 1,
  },
  deliveryLabel: {
    color: "#9E9E9E",
    fontSize: 12,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.BLACK,
    marginRight: 4,
  },

  // RIGHT SECTION
  etaContainer: {
    alignItems: "flex-end",
  },
  etaLabel: {
    fontSize: 12,
    color: "#9E9E9E",
    marginBottom: 4,
  },
  etaBadge: {
    backgroundColor: "#63C05B",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  etaText: {
    color: COLORS.WHITE,
    fontSize: 13,
    fontWeight: "600",
  },
  cartContainer: {
    width: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: COLORS.ERROR,
    borderRadius: 10,
    paddingHorizontal: 5,
    height: 18,
    minWidth: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: COLORS.WHITE,
    fontSize: 10,
    fontWeight: "bold",
  },
});
