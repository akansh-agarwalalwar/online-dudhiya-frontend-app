import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import COLORS from "../constants/Color";
import OrderCard from "../components/core/Order/OrderCard";
import BottomSheet from "../components/common/BottomSheet";
import AppHeader from "../components/common/AppHeader";
import { Mail, Phone, User, Package, Truck, CheckCircle } from "lucide-react-native";
import { getCustomerOrders } from "../redux/thunks/orderThunk";
import { selectOrders, selectOrderLoading, selectOrderError } from "../redux/slices/orderSlice";

const MyOrdersScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("Active");
  const [showSheet, setShowSheet] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Redux state
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);

  // Fetch orders on mount
  useEffect(() => {
    dispatch(getCustomerOrders());
  }, [dispatch]);
  console.log("orders", orders);

  // Filter orders by status
  const getFilteredOrders = () => {
    if (!orders || orders.length === 0) return [];

    switch (tab) {
      case "Active":
        // Active orders: PENDING, PROCESSING, SHIPPED, OUT_FOR_DELIVERY
        return orders.filter(order =>
          ['PENDING', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(order.deliveryStatus)
        );
      case "Completed":
        // Completed orders: COMPLETED or DELIVERED
        return orders.filter(order =>
          ['COMPLETED', 'DELIVERED'].includes(order.deliveryStatus)
        );
      case "Cancelled":
        // Cancelled orders: CANCELLED, REJECTED
        return orders.filter(order =>
          ['CANCELLED', 'REJECTED'].includes(order.deliveryStatus)
        );
      default:
        return orders;
    }
  };

  const getStatusBackgroundColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return '#FFF3CD';
      case 'CONFIRMED': return '#D1ECF1';
      case 'PROCESSING':
      case 'PREPARING': return '#E2E3E5';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY': return '#D4EDDA';
      case 'COMPLETED':
      case 'DELIVERED': return '#D4EDDA';
      case 'CANCELLED':
      case 'REJECTED': return '#F8D7DA';
      case 'RETURNED': return '#E7E8EA';
      default: return '#8ADEFF';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return '#856404';
      case 'CONFIRMED': return '#0C5460';
      case 'PROCESSING':
      case 'PREPARING': return '#6C757D';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY': return '#155724';
      case 'COMPLETED':
      case 'DELIVERED': return '#155724';
      case 'CANCELLED':
      case 'REJECTED': return '#721C24';
      case 'RETURNED': return '#495057';
      default: return COLORS.PRIMARY;
    }
  };

  const getDeliveryStatusText = (order) => {
    if (!order) return '';

    // Get current date (start of day)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check Delivery Date first
    if (order.deliveryDate) {
      const dDate = new Date(order.deliveryDate);
      const deliveryDay = new Date(dDate.getFullYear(), dDate.getMonth(), dDate.getDate());
      const diffTime = deliveryDay - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today Morning";
      if (diffDays === 1) return "Tomorrow Morning";
      return dDate.toDateString();
    }

    // Fallback to Order Date
    if (order.orderDate) {
      const oDate = new Date(order.orderDate);
      const orderDay = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate());
      const diffTime = today - orderDay;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // If ordered Today (diff 0) -> Delivery is Today
      if (diffDays === 0) return "Tomorrow Morning";

      // If ordered Yesterday (diff 1) -> Delivery is Tomorrow
      if (diffDays === 1) return "Today Morning";

      return new Date(order.orderDate).toDateString();
    }

    return '';
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setShowSheet(true);
  };

  const getProgressWidth = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
      case 'CONFIRMED':
        return '10%';
      case 'PROCESSING':
      case 'PREPARING':
        return '40%';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return '70%';
      case 'COMPLETED':
      case 'DELIVERED':
        return '100%';
      case 'CANCELLED':
      case 'REJECTED':
      case 'RETURNED':
        return '0%';
      default:
        return '0%';
    }
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => dispatch(getCustomerOrders())}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : getFilteredOrders().length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {tab === "Cancelled"
                ? "No cancelled orders"
                : tab === "Completed"
                  ? "No completed orders yet"
                  : "No active orders"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={getFilteredOrders()}
            renderItem={({ item }) => (
              <OrderCard order={item} onPress={() => openDetails(item)} />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              tab === "Completed" && getFilteredOrders().length > 0 ? (
                <Text style={styles.sectionTitle}>Recent Orders</Text>
              ) : null
            }
          />
        )}
      </View>

      {/* Bottom Sheet */}
      <BottomSheet visible={showSheet} onClose={() => setShowSheet(false)}>
        {selectedOrder && (
          <ScrollView style={styles.sheetContent} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetOrderNo}>Order #{selectedOrder.orderNo}</Text>
                <Text style={styles.dateText}>
                  {getDeliveryStatusText(selectedOrder)}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusBackgroundColor(selectedOrder.deliveryStatus) }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: getStatusTextColor(selectedOrder.deliveryStatus) }
                ]}>
                  {selectedOrder.deliveryStatus}
                </Text>
              </View>
            </View>

            {/* Horizontal Tracker */}
            {['PENDING', 'CONFIRMED', 'PROCESSING', 'PREPARING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'COMPLETED', 'DELIVERED'].includes(selectedOrder.deliveryStatus) && (
              <View style={styles.trackingContainer}>
                {/* Progress Bar Container */}
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: getProgressWidth(selectedOrder.deliveryStatus) }
                    ]}
                  />
                </View>

                {/* Steps */}
                <View style={styles.stepsContainer}>
                  {/* Step 1: Placed */}
                  <View style={styles.step}>
                    <View style={[styles.iconContainer, styles.activeIconContainer]}>
                      <Package size={18} color={COLORS.WHITE} />
                    </View>
                    <Text style={[styles.stepText, styles.activeStepText]}>Placed</Text>
                  </View>

                  {/* Step 2: Out for Delivery */}
                  <View style={styles.step}>
                    <View style={[
                      styles.iconContainer,
                      ['SHIPPED', 'OUT_FOR_DELIVERY', 'COMPLETED', 'DELIVERED'].includes(selectedOrder.deliveryStatus) ? styles.activeIconContainer : styles.inactiveIconContainer
                    ]}>
                      <Truck
                        size={18}
                        color={['SHIPPED', 'OUT_FOR_DELIVERY', 'COMPLETED', 'DELIVERED'].includes(selectedOrder.deliveryStatus) ? COLORS.WHITE : COLORS.GRAY}
                      />
                    </View>
                    <Text style={[
                      styles.stepText,
                      ['SHIPPED', 'OUT_FOR_DELIVERY', 'COMPLETED', 'DELIVERED'].includes(selectedOrder.deliveryStatus) && styles.activeStepText
                    ]}>Out for Delivery</Text>
                  </View>

                  {/* Step 3: Delivered */}
                  <View style={styles.step}>
                    <View style={[
                      styles.iconContainer,
                      ['COMPLETED', 'DELIVERED'].includes(selectedOrder.deliveryStatus) ? styles.activeIconContainer : styles.inactiveIconContainer
                    ]}>
                      <CheckCircle
                        size={18}
                        color={['COMPLETED', 'DELIVERED'].includes(selectedOrder.deliveryStatus) ? COLORS.WHITE : COLORS.GRAY}
                      />
                    </View>
                    <Text style={[
                      styles.stepText,
                      ['COMPLETED', 'DELIVERED'].includes(selectedOrder.deliveryStatus) && styles.activeStepText
                    ]}>Delivered</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Items List */}
            <Text style={styles.sectionHeader}>Items</Text>
            {selectedOrder.lineItems?.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Image
                  source={{ uri: item.images?.[0]?.url || 'https://via.placeholder.com/80' }}
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.medicineName}</Text>
                  <Text style={styles.itemSub}>
                    {item.sizeName ? `${item.sizeName} • ` : ''}Qty: {item.quantity}
                  </Text>
                  <Text style={styles.itemPrice}>₹{item.salePriceAtOrder}</Text>
                </View>
              </View>
            ))}

            {/* Order Summary */}
            <View style={styles.billSection}>
              <Text style={styles.sectionHeader}>Payment Summary</Text>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Subtotal</Text>
                <Text style={styles.billValue}>₹{selectedOrder.totalAmount}</Text>
              </View>
              <View style={[styles.billRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{selectedOrder.finalAmount}</Text>
              </View>
            </View>

            {/* Action Buttons (Optional placeholder for tracking if needed later) */}
            {['SHIPPED', 'OUT_FOR_DELIVERY'].includes(selectedOrder.deliveryStatus) && (
              <TouchableOpacity style={styles.trackSheetBtn}>
                <Text style={styles.trackSheetBtnText}>Track Delivery</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.GRAY,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.ERROR || '#FF0000',
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
  sheetContent: {
    paddingBottom: 20,
    paddingHorizontal: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 10,
  },
  sheetOrderNo: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.DARK,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.GRAY,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.DARK,
    marginBottom: 16,
    marginTop: 8,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#fff',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.DARK,
    marginBottom: 4,
  },
  itemSub: {
    fontSize: 13,
    color: COLORS.GRAY,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  billSection: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
  billValue: {
    fontSize: 14,
    color: COLORS.DARK,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.DARK,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  trackSheetBtn: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  trackSheetBtnText: {
    fontWeight: '600',
  },
  trackingContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 4,
    position: 'absolute',
    top: 15, // Adjusted top to be centered with 34px height icons (approx)
    left: 40,
    right: 40,
    zIndex: -1,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  step: {
    alignItems: 'center',
    width: 90,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: COLORS.WHITE,
    zIndex: 1
  },
  activeIconContainer: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  inactiveIconContainer: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
  stepText: {
    fontSize: 11,
    color: COLORS.GRAY,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeStepText: {
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
});
