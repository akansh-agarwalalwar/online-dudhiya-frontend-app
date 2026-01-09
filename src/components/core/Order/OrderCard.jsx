import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "../../../constants/Color";
import { Clock, Phone } from "lucide-react-native";

const OrderCard = ({ order, onPress }) => {
    // Extract first line item for display
    const firstItem = order?.lineItems?.[0];
    const totalItems = order?.lineItems?.length || 0;

    // Get product image from first item
    const productImage = firstItem?.images?.[0]?.url || "https://via.placeholder.com/150";

    // Determine order status
    // Determine order status - Check orderStatus first for cancellations
    const orderStatus = order?.orderStatus;
    const isOrderCancelled = ['CANCELLED', 'CANCELLED_BY_CUSTOMER', 'REJECTED'].includes(orderStatus);

    // If order is cancelled, override deliveryStatus
    const effectiveStatus = isOrderCancelled ? (orderStatus === 'CANCELLED_BY_CUSTOMER' ? 'CANCELLED' : orderStatus) : (order?.deliveryStatus || "PENDING");

    const deliveryStatus = effectiveStatus;
    const isActive = ['PENDING', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(deliveryStatus);
    const isCompleted = ['DELIVERED', 'COMPLETED'].includes(deliveryStatus);
    const isCancelled = ['CANCELLED', 'REJECTED'].includes(deliveryStatus);

    // Function to get status background color based on status
    const getStatusBackgroundColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return '#FFF3CD'; // Light yellow
            case 'CONFIRMED':
                return '#D1ECF1'; // Light blue
            case 'PROCESSING':
            case 'PREPARING':
                return '#E2E3E5'; // Light gray
            case 'SHIPPED':
            case 'OUT_FOR_DELIVERY':
                return '#D4EDDA'; // Light green
            case 'COMPLETED':
            case 'DELIVERED':
                return '#D4EDDA'; // Light green for completed
            case 'CANCELLED':
            case 'REJECTED':
                return '#F8D7DA'; // Light red
            case 'RETURNED':
                return '#E7E8EA'; // Light gray-blue
            default:
                return '#8ADEFF'; // Default light cyan
        }
    };

    // Function to get status text color based on status
    const getStatusTextColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return '#856404'; // Dark yellow
            case 'CONFIRMED':
                return '#0C5460'; // Dark blue
            case 'PROCESSING':
            case 'PREPARING':
                return '#6C757D'; // Dark gray
            case 'SHIPPED':
            case 'OUT_FOR_DELIVERY':
                return '#155724'; // Dark green
            case 'COMPLETED':
            case 'DELIVERED':
                return '#155724'; // Dark green for completed
            case 'CANCELLED':
            case 'REJECTED':
                return '#721C24'; // Dark red
            case 'RETURNED':
                return '#495057'; // Dark gray-blue
            default:
                return COLORS.PRIMARY; // Default primary color
        }
    };

    // Format status for display
    const formatStatus = (status) => {
        if (!status) return 'Pending';
        return status.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    // Build subtitle with quantity and size info
    const buildSubtitle = () => {
        if (!firstItem) return '';

        const parts = [];
        if (firstItem.quantity) {
            parts.push(`${firstItem.quantity}x ${firstItem.medicineName}`);
        } else {
            parts.push(firstItem.medicineName);
        }

        if (firstItem.sizeName) {
            parts.push(firstItem.sizeName);
        }

        if (totalItems > 1) {
            parts.push(`+${totalItems - 1} more item${totalItems - 1 > 1 ? 's' : ''}`);
        }

        return parts.join(' • ');
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.card}>
                <Image source={{ uri: productImage }} style={styles.img} />
                <View style={{ flex: 1 }}>
                    {/* Title and Status */}
                    <View style={styles.rowBetween}>
                        <Text style={styles.title} numberOfLines={1}>
                            {firstItem?.medicineName || 'Order'}
                        </Text>
                        <Text style={[
                            styles.status,
                            {
                                backgroundColor: getStatusBackgroundColor(deliveryStatus),
                                color: getStatusTextColor(deliveryStatus)
                            }
                        ]}>
                            {formatStatus(deliveryStatus)}
                        </Text>
                    </View>

                    {/* Order ID */}
                    <Text style={styles.orderNo}>Order #{order?.id?.slice(0, 8)}</Text>
                </View>
            </View>

            {/* Items and Price */}
            <View style={styles.rowBetween}>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {buildSubtitle()}
                </Text>
                <Text style={styles.price}>₹{order?.finalAmount || '0'}</Text>
            </View>

            {/* Delivery Info */}
            <View style={styles.rowBetween}>
                <Text style={styles.estimate}>
                    {isActive ? "Estimated delivery" : isCompleted ? "Delivered on" : "Order placed"}
                </Text>
                <Text style={styles.estimateTime}>
                    {order?.deliveryDate
                        ? new Date(order.deliveryDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })
                        : 'To be confirmed'}
                </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                {isActive ? (
                    <>
                        <TouchableOpacity style={styles.trackBtn} onPress={onPress}>
                            <Text style={styles.trackText}>Track Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.callBtn}>
                            <Phone color={COLORS.PRIMARY} size={22} />
                        </TouchableOpacity>
                    </>
                ) : isCompleted ? (
                    <>
                        <TouchableOpacity style={styles.buyAgainBtn} onPress={onPress}>
                            <Text style={styles.buyAgainText}>Buy Again</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.historyBtn}>
                            <Clock color={COLORS.PRIMARY} size={22} />
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.viewDetailsBtn} onPress={onPress}>
                        <Text style={styles.viewDetailsText}>View Details</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default OrderCard;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 4,
        marginVertical: 6,
        borderRadius: 16,
        backgroundColor: COLORS.WHITE,
        padding: 16,
        shadowColor: COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    card: {
        flexDirection: "row",
        gap: 12,
    },
    img: {
        width: 55,
        height: 55,
        borderRadius: 10,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.DARK,
    },
    orderNo: {
        fontSize: 13,
        color: COLORS.GRAY,
        marginTop: 2,
    },
    subtitle: {
        color: COLORS.GRAY,
        fontSize: 13,
    },
    price: {
        fontWeight: "700",
        fontSize: 15,
        color: COLORS.DARK,
    },
    estimate: {
        color: COLORS.GRAY,
        fontSize: 13,
    },
    estimateTime: {
        fontSize: 13,
        color: COLORS.DARK,
        fontWeight: "500",
    },
    status: {
        paddingVertical: 4,
        paddingHorizontal: 14,
        borderRadius: 12,
        fontSize: 13,
        fontWeight: "600",
        alignSelf: "flex-start",
        marginLeft: 8,
    },
    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        gap: 10,
    },
    trackBtn: {
        flex: 1,
        backgroundColor: COLORS.PRIMARY,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    trackText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontWeight: "500",
    },
    callBtn: {
        width: 44,
        height: 44,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#EAF8ED",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.WHITE,
    },
    buyAgainBtn: {
        flex: 1,
        backgroundColor: "#eaf4f8ff",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    buyAgainText: {
        color: COLORS.PRIMARY,
        fontSize: 16,
        fontWeight: "500",
    },
    historyBtn: {
        width: 44,
        height: 44,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#EAF8ED",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.WHITE,
    },
    historyText: {
        fontSize: 20,
    },
    viewDetailsBtn: {
        flex: 1,
        backgroundColor: COLORS.PRIMARY,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    viewDetailsText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontWeight: "500",
    },
});
