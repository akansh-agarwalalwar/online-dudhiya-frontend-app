import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle } from 'lucide-react-native';
import COLORS from '../constants/Color';
import { getOrderById } from '../redux/thunks/orderThunk';
import { selectCurrentOrder, selectOrderLoading } from '../redux/slices/orderSlice';

const OrderConfirmation = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const { orderId } = route.params || {};
    const order = useSelector(selectCurrentOrder);
    const loading = useSelector(selectOrderLoading);

    useEffect(() => {
        if (orderId) {
            dispatch(getOrderById(orderId));
        }
    }, [orderId, dispatch]);

    const handleContinueShopping = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
        });
    };

    const handleViewOrders = () => {
        navigation.reset({
            index: 1,
            routes: [{ name: 'MainTabs' }, { name: 'MyOrders' }],
        });
    };

    if (loading || !order) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                    <Text style={styles.loadingText}>Loading order details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount || 0).toFixed(2)}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Success Header */}
                <View style={styles.successHeader}>
                    <View style={styles.successIconContainer}>
                        <CheckCircle size={80} color={COLORS.SUCCESS} />
                    </View>
                    <Text style={styles.successTitle}>Order Placed Successfully!</Text>
                    <Text style={styles.successSubtitle}>
                        Thank you for your order
                    </Text>
                    <View style={styles.orderNumberContainer}>
                        <Text style={styles.orderNumberLabel}>Order Number</Text>
                        <Text style={styles.orderNumber}>{order.orderNo}</Text>
                    </View>
                </View>

                {/* Order Details Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Order Details</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Order Date</Text>
                        <Text style={styles.detailValue}>{formatDate(order.orderDate)}</Text>
                    </View>

                    {order.deliveryDate && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Expected Delivery</Text>
                            <Text style={styles.detailValue}>{formatDate(order.deliveryDate)}</Text>
                        </View>
                    )}

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Order Status</Text>
                        <View style={[styles.statusBadge, styles[`status${order.orderStatus}`]]}>
                            <Text style={styles.statusText}>{order.orderStatus}</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Payment Method</Text>
                        <Text style={styles.detailValue}>{order.payment?.paymentMethod || 'N/A'}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Payment Status</Text>
                        <View style={[styles.statusBadge, styles[`payment${order.payment?.status}`]]}>
                            <Text style={styles.statusText}>{order.payment?.status || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                {/* Delivery Address Card */}
                {order.deliveryAddress && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Delivery Address</Text>
                        <Text style={styles.addressName}>{order.deliveryAddress.name}</Text>
                        <Text style={styles.addressText}>
                            {order.deliveryAddress.addressLine1}
                            {order.deliveryAddress.addressLine2 && `, ${order.deliveryAddress.addressLine2}`}
                        </Text>
                        <Text style={styles.addressText}>
                            {order.deliveryAddress.cityDistrict}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                        </Text>
                        <Text style={styles.addressPhone}>
                            Phone: {order.deliveryAddress.phoneNumber}
                        </Text>
                    </View>
                )}

                {/* Order Items Card */}
                {order.lineItems && order.lineItems.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Order Items ({order.lineItems.length})</Text>
                        {order.lineItems.map((item, index) => (
                            <View key={index} style={styles.itemRow}>
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.medicineName}</Text>
                                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                                </View>
                                <View style={styles.itemPricing}>
                                    <Text style={styles.itemPrice}>{formatCurrency(item.salePriceAtOrder)}</Text>
                                    {item.mrpAtOrder > item.salePriceAtOrder && (
                                        <Text style={styles.itemMrp}>{formatCurrency(item.mrpAtOrder)}</Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Price Summary Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Price Summary</Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Subtotal</Text>
                        <Text style={styles.priceValue}>{formatCurrency(order.totalAmount)}</Text>
                    </View>

                    {order.discountAmount > 0 && (
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Discount</Text>
                            <Text style={[styles.priceValue, styles.discountText]}>
                                -{formatCurrency(order.discountAmount)}
                            </Text>
                        </View>
                    )}

                    {order.deliveryCharge > 0 && (
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Delivery Charges</Text>
                            <Text style={styles.priceValue}>{formatCurrency(order.deliveryCharge)}</Text>
                        </View>
                    )}

                    <View style={styles.divider} />

                    <View style={styles.priceRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>{formatCurrency(order.finalAmount)}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleContinueShopping}
                    >
                        <Text style={styles.primaryButtonText}>Continue Shopping</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={handleViewOrders}
                    >
                        <Text style={styles.secondaryButtonText}>View All Orders</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND || '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.GRAY,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    successHeader: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        marginBottom: 16,
    },
    successIconContainer: {
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.DARK,
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 16,
        color: COLORS.GRAY,
        marginBottom: 20,
    },
    orderNumberContainer: {
        backgroundColor: COLORS.LIGHT_GRAY || '#F0F0F0',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    orderNumberLabel: {
        fontSize: 12,
        color: COLORS.GRAY,
        marginBottom: 4,
        textAlign: 'center',
    },
    orderNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.PRIMARY,
        textAlign: 'center',
    },
    card: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.DARK,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.LIGHT_GRAY || '#F0F0F0',
    },
    detailLabel: {
        fontSize: 14,
        color: COLORS.GRAY,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.DARK,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusPLACED: {
        backgroundColor: '#E8F5E9',
    },
    statusDRAFT: {
        backgroundColor: '#FFF3E0',
    },
    statusPAYMENT_INITIATED: {
        backgroundColor: '#E3F2FD',
    },
    statusCANCELLED_BY_CUSTOMER: {
        backgroundColor: '#FFEBEE',
    },
    paymentPAID: {
        backgroundColor: '#E8F5E9',
    },
    paymentUNPAID: {
        backgroundColor: '#FFF3E0',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.DARK,
    },
    addressName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.DARK,
        marginBottom: 8,
    },
    addressText: {
        fontSize: 14,
        color: COLORS.GRAY,
        marginBottom: 4,
        lineHeight: 20,
    },
    addressPhone: {
        fontSize: 14,
        color: COLORS.GRAY,
        marginTop: 8,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.LIGHT_GRAY || '#F0F0F0',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.DARK,
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 12,
        color: COLORS.GRAY,
    },
    itemPricing: {
        alignItems: 'flex-end',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.DARK,
    },
    itemMrp: {
        fontSize: 12,
        color: COLORS.GRAY,
        textDecorationLine: 'line-through',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    priceLabel: {
        fontSize: 14,
        color: COLORS.GRAY,
    },
    priceValue: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.DARK,
    },
    discountText: {
        color: COLORS.SUCCESS || '#4CAF50',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.LIGHT_GRAY || '#F0F0F0',
        marginVertical: 12,
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
    actionButtons: {
        marginTop: 8,
    },
    primaryButton: {
        backgroundColor: COLORS.PRIMARY,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.WHITE,
    },
    secondaryButton: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.PRIMARY,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.PRIMARY,
    },
});

export default OrderConfirmation;
