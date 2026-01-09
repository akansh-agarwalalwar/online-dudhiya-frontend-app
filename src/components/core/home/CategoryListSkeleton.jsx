import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ScrollView } from 'react-native';
import COLORS from '../../../constants/Color';

const CategoryCardSkeleton = ({ delay = 0 }) => {
    const shimmerAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Add delay for staggered animation
        const timeout = setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(shimmerAnimation, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shimmerAnimation, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }, delay);

        return () => clearTimeout(timeout);
    }, [shimmerAnimation, delay]);

    const opacity = shimmerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View style={[styles.categoryCard, { opacity }]}>
            <View style={styles.iconSkeleton} />
            <View style={styles.textSkeleton} />
        </Animated.View>
    );
};

const CategoryListSkeleton = ({ count = 6 }) => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.headerRow}>
                <View style={styles.titleSkeleton} />
                <View style={styles.seeAllSkeleton} />
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {Array.from({ length: count }).map((_, index) => (
                    <CategoryCardSkeleton key={index} delay={index * 100} />
                ))}
            </ScrollView>
        </View>
    );
};

export default CategoryListSkeleton;

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 12,
    },
    titleSkeleton: {
        height: 24,
        width: 180,
        backgroundColor: COLORS.LIGHT_GRAY || '#E0E0E0',
        borderRadius: 6,
    },
    seeAllSkeleton: {
        height: 20,
        width: 60,
        backgroundColor: COLORS.LIGHT_GRAY || '#E0E0E0',
        borderRadius: 4,
    },
    scrollContent: {
        paddingHorizontal: 10,
        marginTop: 40,
        paddingBottom: 10,
    },
    categoryCard: {
        alignItems: 'center',
        marginHorizontal: 8,
        width: 70,
    },
    iconSkeleton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: COLORS.LIGHT_GRAY || '#E0E0E0',
        marginBottom: 8,
    },
    textSkeleton: {
        height: 12,
        width: 60,
        backgroundColor: COLORS.LIGHT_GRAY || '#E0E0E0',
        borderRadius: 4,
    },
});
