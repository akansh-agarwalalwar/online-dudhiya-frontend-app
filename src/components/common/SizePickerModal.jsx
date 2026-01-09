import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import COLORS from '../../constants/Color';

const SizePickerModal = ({ visible, onClose, sizes, productName, onSelectSize }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerContent}>
                            <Text style={styles.title}>Select Size</Text>
                            <Text style={styles.productName} numberOfLines={1}>{productName}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={COLORS.DARK} />
                        </TouchableOpacity>
                    </View>

                    {/* Sizes List */}
                    <ScrollView style={styles.sizesList} showsVerticalScrollIndicator={false}>
                        {sizes && sizes.length > 0 ? (
                            sizes.map((size) => (
                                <TouchableOpacity
                                    key={size.id}
                                    style={[
                                        styles.sizeItem,
                                        !size.inStock && styles.sizeItemDisabled
                                    ]}
                                    onPress={() => size.inStock && onSelectSize(size)}
                                    disabled={!size.inStock}
                                >
                                    <View style={styles.sizeInfo}>
                                        <Text style={[
                                            styles.sizeName,
                                            !size.inStock && styles.disabledText
                                        ]}>
                                            {size.sizeName}
                                        </Text>
                                        {!size.inStock && (
                                            <Text style={styles.outOfStockText}>Out of Stock</Text>
                                        )}
                                    </View>
                                    <View style={styles.priceContainer}>
                                        {size.mrp && size.mrp > size.salePrice && (
                                            <Text style={styles.mrpText}>₹{size.mrp}</Text>
                                        )}
                                        <Text style={[
                                            styles.priceText,
                                            !size.inStock && styles.disabledText
                                        ]}>
                                            ₹{size.salePrice}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No sizes available</Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Cancel Button */}
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.WHITE,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '70%',
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerContent: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.DARK,
        marginBottom: 4,
    },
    productName: {
        fontSize: 14,
        color: COLORS.GRAY,
        fontWeight: '500',
    },
    closeButton: {
        padding: 4,
    },
    sizesList: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    sizeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    sizeItemDisabled: {
        opacity: 0.5,
        backgroundColor: '#F5F5F5',
    },
    sizeInfo: {
        flex: 1,
    },
    sizeName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.DARK,
        marginBottom: 4,
    },
    outOfStockText: {
        fontSize: 12,
        color: '#DC3545',
        fontWeight: '500',
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    mrpText: {
        fontSize: 13,
        color: COLORS.GRAY,
        textDecorationLine: 'line-through',
        marginBottom: 2,
    },
    priceText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.PRIMARY,
    },
    disabledText: {
        color: COLORS.GRAY,
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.GRAY,
    },
    cancelButton: {
        marginHorizontal: 20,
        marginTop: 12,
        paddingVertical: 14,
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.DARK,
    },
});

export default SizePickerModal;
