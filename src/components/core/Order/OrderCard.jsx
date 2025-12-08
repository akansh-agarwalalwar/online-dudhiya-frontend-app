import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "../../../constants/Color";
import { Clock, Phone } from "lucide-react-native"; // Lucide icon import

const OrderCard = ({ item, onPress }) => {
    const isCompleted = item.isCompleted;
    const isActive = item.isActive;

    // Function to get status background color based on status
    const getStatusBackgroundColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return '#FFF3CD'; // Light yellow
            case 'confirmed':
                return '#D1ECF1'; // Light blue
            case 'preparing':
                return '#E2E3E5'; // Light gray
            case 'shipped':
            case 'out for delivery':
                return '#D4EDDA'; // Light green
            case 'delivered':
                return '#8ADEFF'; // Light cyan (original color)
            case 'cancelled':
                return '#F8D7DA'; // Light red
            case 'returned':
                return '#E7E8EA'; // Light gray-blue
            default:
                return '#8ADEFF'; // Default light cyan
        }
    };

    // Function to get status text color based on status
    const getStatusTextColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return '#856404'; // Dark yellow
            case 'confirmed':
                return '#0C5460'; // Dark blue
            case 'preparing':
                return '#6C757D'; // Dark gray
            case 'shipped':
            case 'out for delivery':
                return '#155724'; // Dark green
            case 'delivered':
                return COLORS.PRIMARY; // Primary color (original)
            case 'cancelled':
                return '#721C24'; // Dark red
            case 'returned':
                return '#495057'; // Dark gray-blue
            default:
                return COLORS.PRIMARY; // Default primary color
        }
    };

    return (
        <TouchableOpacity style={styles.container} >
            <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.img} />
                <View style={{ flex: 1 }}>
                    {/* Title and Status */}
                    <View style={styles.rowBetween}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={[
                            styles.status,
                            {
                                backgroundColor: getStatusBackgroundColor(item.status),
                                color: getStatusTextColor(item.status)  // ← Text color changes here
                            }
                        ]}>
                            {item.status}
                        </Text>
                    </View>

                    {/* Order Number for Active Orders */}
                    {isActive && (
                        <Text style={styles.orderNo}>Order #{item.orderNo}</Text>
                    )}

                    {/* Date for Completed Orders */}
                    {isCompleted && (
                        <Text style={styles.orderNo}>{item.deliveryDate}</Text>
                    )}
                </View>
            </View>
            {/* Items and Price */}
            <View style={styles.rowBetween}>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
            </View>

            {/* Delivery Info */}
            <View style={styles.rowBetween}>
                <Text style={styles.estimate}>
                    {isActive ? "Estimated delivery" : "Already delivered"}
                </Text>
                <Text style={styles.estimateTime}>
                    {isActive ? item.estimatedDelivery : item.deliveryTime}
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
                ) : (
                    <>
                        <TouchableOpacity style={styles.buyAgainBtn} onPress={onPress}>
                            <Text style={styles.buyAgainText}>Buy Again</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.historyBtn}>
                            <Text style={styles.historyText}><Clock color={COLORS.PRIMARY} size={22} /></Text>
                        </TouchableOpacity>
                    </>
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
});
