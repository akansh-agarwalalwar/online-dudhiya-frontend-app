import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../constants/Color";
import OrderCard from "../components/core/Order/OrderCard";
import BottomSheet from "../components/common/BottomSheet";
import AppHeader from "../components/common/AppHeader";
import { Mail, Phone, User } from "lucide-react-native";

const MyOrdersScreen = () => {
  const navigation = useNavigation();
  const [tab, setTab] = useState("Active");
  const [showSheet, setShowSheet] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const activeOrders = [
    {
      id: 1,
      title: "Fresh Vegetable",
      subtitle: "3 items",
      price: "24.99",
      status: "In Progress",
      statusColor: "#EAF8ED",
      orderNo: "ORD-2025-001",
      estimatedDelivery: "Today, 4:30 PM",
      image: "https://cdn.shopify.com/s/files/1/0445/1365/6985/files/fresh-vegetables.jpg?v=1638206015",
      isActive: true,
    },
  ];

  const completedOrders = [
    {
      id: 2,
      title: "Soyabin Oil",
      subtitle: "2 items",
      price: "8.40",
      status: "Delivered",
      statusColor: "#EAF8ED",
      deliveryDate: "Jan 12, 2025",
      deliveryTime: "1:15 PM",
      image: "https://cdn.shopify.com/s/files/1/0445/1365/6985/files/fresh-vegetables.jpg?v=1638206015",
      isCompleted: true,
    },
    {
      id: 3,
      title: "Strawberry",
      subtitle: "1 items",
      price: "2.99",
      status: "Delivered",
      statusColor: "#EAF8ED",
      deliveryDate: "Jan 12, 2025",
      deliveryTime: "2:10 PM",
      image: "https://cdn.shopify.com/s/files/1/0445/1365/6985/files/fresh-vegetables.jpg?v=1638206015",
      isCompleted: true,
    },
  ];

  const getCurrentOrders = () => {
    switch (tab) {
      case "Active":
        return activeOrders;
      case "Completed":
        return completedOrders;
      case "Cancelled":
        return [];
      default:
        return activeOrders;
    }
  };

  const openDetails = (item) => {
    setSelectedOrder(item);
    setShowSheet(true);
  };

  return (
    <View style={styles.container}>
        <AppHeader title="My Orders" showBackButton={true} onBackPress={() => navigation.goBack()} />
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          {["Active", "Completed", "Cancelled"].map((t) => (
            <TouchableOpacity 
              key={t} 
              style={[styles.tabButton, tab === t && styles.activeTabButton]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        {tab === "Active" && getCurrentOrders().length > 0 && (
          <FlatList
            data={getCurrentOrders()}
            renderItem={({ item }) => (
              <OrderCard item={item} onPress={() => openDetails(item)} />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}

        {tab === "Completed" && (
          <FlatList
            data={getCurrentOrders()}
            renderItem={({ item }) => (
              <OrderCard item={item} onPress={() => openDetails(item)} />
            )}
            ListHeaderComponent={<Text style={styles.sectionTitle}>Recent Orders</Text>}
            showsVerticalScrollIndicator={false}
          />
        )}

        {tab === "Cancelled" && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cancelled orders</Text>
          </View>
        )}
      </View>

      {/* Bottom Sheet */}
      <BottomSheet visible={showSheet} onClose={() => setShowSheet(false)}>
        {selectedOrder && (
          <>
            <View style={styles.riderSection}>
              <View style={styles.riderInfo}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        <User />
                    </Text>
                  </View>
                </View>
                <View style={styles.riderDetails}>
                  <Text style={styles.riderLabel}>Your Rider</Text>
                  <Text style={styles.riderName}>Mc Carlos</Text>
                </View>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.messageButton}>
                  <View style={styles.messageIcon}>
                    <Text style={styles.iconText}>
                        <Mail size={24} color={COLORS.WHITE} />
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.callButton}>
                  <View style={styles.callIcon}>
                    <Text style={styles.iconText}>
                        <Phone size={24} color={COLORS.WHITE} />
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.etaContainer}>
              <View style={styles.clockIcon}>
                <Text style={styles.clockText}>🕐</Text>
              </View>
              <Text style={styles.eta}>About 30 minutes will come</Text>
            </View>

            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>From</Text>
                  <Text style={styles.timelineAddress}>114 uk, Avenue</Text>
                </View>
                <Text style={styles.timelineTime}>12:30{'\n'}PM</Text>
              </View>
              
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.activeDot]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>on the way</Text>
                </View>
                <Text style={styles.timelineTime}>12:45 PM</Text>
              </View>
              
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.futureDot]} />
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, styles.futureText]}>Delivered to you</Text>
                </View>
                <Text style={[styles.timelineTime, styles.futureText]}>1:00PM</Text>
              </View>
            </View>
          </>
        )}
      </BottomSheet>
    </View>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  tabsContainer: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: COLORS.WHITE,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.GRAY,
    fontWeight: "500",
  },
  activeTabText: {
    color: COLORS.WHITE,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.DARK,
    marginVertical: 16,
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  riderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  riderDetails: {
    flex: 1,
  },
  riderLabel: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 2,
  },
  riderName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.DARK,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  messageButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    color: 'white',
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 8,
  },
  clockIcon: {
    marginRight: 12,
  },
  clockText: {
    fontSize: 18,
    color: '#4CAF50',
  },
  eta: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 4,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.PRIMARY,
    marginRight: 16,
  },
  activeDot: {
    backgroundColor: COLORS.PRIMARY,
  },
  futureDot: {
    backgroundColor: '#E0E0E0',
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 16,
    color: COLORS.DARK,
    fontWeight: '500',
  },
  timelineAddress: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginTop: 2,
  },
  timelineTime: {
    fontSize: 14,
    color: COLORS.DARK,
    fontWeight: '500',
    textAlign: 'right',
  },
  futureText: {
    color: COLORS.GRAY,
  },
});
