import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SearchResultCard = ({ product }) => {
    const navigation = useNavigation();
    if (!product) return null;

    const {
        id,
        product_name,
        description,
        images = [],
        sale_price,
        mrp,
        packaging_size,
        sizes = [],
        categories = [],
    } = product;

    // Safety checks for arrays in case they are null in the backend response
    const safeImages = images || [];
    const safeSizes = sizes || [];
    const safeCategories = categories || [];

    const productImage = safeImages.length > 0 ? safeImages[0] : null;

    // ---------------------------
    // PRICE & DISCOUNT LOGIC
    // ---------------------------
    const calculateDiscount = (mrp, salePrice) => {
        const m = Number(mrp);
        const s = Number(salePrice);
        if (!m || !s || m <= s) return 0;
        return Math.round(((m - s) / m) * 100);
    };

    let displayPrice, displayMrp, discountPercent, firstSize;

    if (safeSizes.length > 0) {
        // PRODUCT WITH MULTIPLE SIZES
        firstSize = safeSizes[0];
        displayPrice = Number(firstSize.salePrice);
        displayMrp = Number(firstSize.mrp);
        discountPercent = calculateDiscount(displayMrp, displayPrice);
    } else {
        // PRODUCT WITHOUT SIZES
        displayPrice = Number(sale_price);
        displayMrp = Number(mrp);
        discountPercent = calculateDiscount(displayMrp, displayPrice);
    }

    const handlePress = () => {
        navigation.navigate("ProductDetails", {
            productfromRoute: product,
            id
        });
    };

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={handlePress}>

            {/* Discount Badge */}
            {discountPercent > 0 && (
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{discountPercent}% OFF</Text>
                </View>
            )}

            {/* Product Image */}
            <View style={styles.imageWrapper}>
                <Image
                    source={
                        productImage
                            ? { uri: productImage }
                            : require('../../../assets/images/product/milk.png')
                    }
                    style={styles.productImage}
                />
            </View>

            {/* Details */}
            <View style={styles.contentWrapper}>

                {/* Category */}
                {safeCategories.length > 0 && (
                    <Text style={styles.categoryText}>{safeCategories[0]}</Text>
                )}

                {/* Name */}
                <Text style={styles.productName} numberOfLines={2}>
                    {product_name}
                </Text>

                {/* Description */}
                <Text style={styles.description} numberOfLines={2}>
                    {description}
                </Text>

                {/* Sizes Row (ONLY IF SIZES EXIST) */}
                {safeSizes.length > 0 && (
                    <Text style={styles.sizeRow} numberOfLines={1}>
                        Sizes: {safeSizes.map(s => s.sizeName).join(", ")}
                    </Text>
                )}

                {/* PRICE ROW */}
                <View style={styles.priceRow}>
                    <Text style={styles.offerPrice}>₹{displayPrice}</Text>

                    {displayMrp && displayMrp !== displayPrice && (
                        <Text style={styles.mrpPrice}>₹{displayMrp}</Text>
                    )}

                    {safeSizes.length > 0 && firstSize && (
                        <Text style={styles.sizeTag}>({firstSize.sizeName})</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default SearchResultCard;


// -----------------------------
//           STYLES
// -----------------------------
const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#ffffff",
        marginHorizontal: 12,
        marginVertical: 8,
        borderRadius: 14,
        padding: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },

    discountBadge: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#E53935",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderBottomRightRadius: 12,
        zIndex: 10,
    },
    discountText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },

    imageWrapper: {
        width: 110,
        height: 110,
        borderRadius: 12,
        overflow: "hidden",
        marginRight: 12,
        backgroundColor: "#fafafa",
    },
    productImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },

    contentWrapper: {
        flex: 1,
        justifyContent: "space-between",
    },

    categoryText: {
        fontSize: 11,
        color: "#4CAF50",
        fontWeight: "600",
        marginBottom: 4,
    },

    productName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#222",
        marginBottom: 4,
    },

    description: {
        fontSize: 12,
        color: "#777",
        marginBottom: 6,
        lineHeight: 16,
    },

    sizeRow: {
        fontSize: 12,
        color: "#555",
        marginBottom: 6,
    },

    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
        flexWrap: "wrap",
    },

    offerPrice: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
        marginRight: 8,
    },

    mrpPrice: {
        fontSize: 13,
        textDecorationLine: "line-through",
        color: "#999",
        marginRight: 8,
    },

    sizeTag: {
        fontSize: 12,
        color: "#666",
    },
});
