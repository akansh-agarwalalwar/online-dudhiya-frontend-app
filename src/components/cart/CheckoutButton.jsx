import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../../constants/Color';

const CheckoutButton = ({
  totalAmount = 0,
  itemCount = 0,
  onCheckout = () => { },
  isLoading = false,
  disabled = false,
  deliveryChargeInfo = {
    amount: 0,
    isFree: true,
    message: 'Free Delivery',
  },
  deliveryChargeData = null,
}) => {
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const isDisabled = disabled || itemCount === 0 || isLoading;

  // Calculate final total including delivery charge
  const deliveryAmount = deliveryChargeInfo?.amount || 0;
  const finalTotal = totalAmount + deliveryAmount;

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items ({itemCount})</Text>
          <Text style={styles.summaryValue}>{formatPrice(totalAmount)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <View style={styles.deliveryChargeContainer}>
            {deliveryChargeInfo?.isFree && deliveryChargeInfo?.minPurchaseAmount > 0 ? (
              <>
                <Text style={[styles.summaryValue, styles.strikethrough]}>
                  {formatPrice(deliveryChargeInfo.minPurchaseAmount > 0 ? (deliveryChargeData?.amount || 40) : 0)}
                </Text>
                <Text style={[styles.summaryValue, styles.freeDelivery]}>
                  {deliveryChargeInfo.message}
                </Text>
              </>
            ) : deliveryChargeInfo?.isFree ? (
              <Text style={[styles.summaryValue, styles.freeDelivery]}>
                {deliveryChargeInfo.message}
              </Text>
            ) : (
              <Text style={styles.summaryValue}>
                {formatPrice(deliveryAmount)}
              </Text>
            )}
          </View>
        </View>

        {/* Show message about free delivery threshold if applicable */}
        {!deliveryChargeInfo?.isFree && deliveryChargeInfo?.amountToFreeDelivery > 0 && (
          <View style={styles.freeDeliveryHint}>
            <Text style={styles.freeDeliveryHintText}>
              Add {formatPrice(deliveryChargeInfo.amountToFreeDelivery)} more for free delivery
            </Text>
          </View>
        )}

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(finalTotal)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.checkoutButton,
          isDisabled && styles.disabledButton,
        ]}
        onPress={onCheckout}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.checkoutButtonText,
          isDisabled && styles.disabledButtonText,
        ]}>
          {isLoading ? 'Processing...' : 'Proceed to Checkout'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
    elevation: 8,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
    marginTop: 8,
    paddingTop: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.GRAY,
    fontWeight: '400',
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.DARK,
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.DARK,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    color: COLORS.DARK,
    fontWeight: '700',
  },
  checkoutButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  disabledButton: {
    backgroundColor: COLORS.GRAY,
    elevation: 0,
    shadowOpacity: 0,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
    letterSpacing: 0.5,
  },
  disabledButtonText: {
    color: COLORS.WHITE,
    opacity: 0.7,
  },
  freeDelivery: {
    color: COLORS.SUCCESS || COLORS.PRIMARY,
    fontWeight: '600',
  },
  freeDeliveryHint: {
    backgroundColor: COLORS.PRIMARY_LIGHT || '#FFF8E1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  freeDeliveryHintText: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: '500',
    textAlign: 'center',
  },
  deliveryChargeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: COLORS.GRAY,
    fontSize: 12,
    marginRight: 4,
  },
});

export default CheckoutButton;