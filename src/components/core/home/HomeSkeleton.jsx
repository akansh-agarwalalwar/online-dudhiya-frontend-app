import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import COLORS from '../../../constants/Color';

const SectionSkeleton = () => {
    const shimmerAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
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
    }, [shimmerAnimation]);

    const opacity = shimmerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <View style={styles.container}>
            {/* Section Header Skeleton */}
            <View style={styles.headerContainer}>
                <Animated.View style={[styles.titleSkeleton, { opacity }]} />
                <Animated.View style={[styles.viewAllSkeleton, { opacity }]} />
            </View>

            {/* Product Cards Skeleton */}
            <View style={styles.cardsContainer}>
                {[1, 2, 3].map((item) => (
                    <Animated.View key={item} style={[styles.cardSkeleton, { opacity }]}>
                        <View style={styles.imageSkeleton} />
                        <View style={styles.cardContent}>
                            <View style={styles.titleLineSkeleton} />
                            <View style={[styles.titleLineSkeleton, { width: '60%' }]} />
                            <View style={styles.priceSkeleton} />
                            <View style={styles.buttonSkeleton} />
                        </View>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
};

const HomeSkeleton = ({ count = 3 }) => {
    return (
        <View style={styles.wrapper}>
            {Array.from({ length: count }).map((_, index) => (
                <SectionSkeleton key={index} />
            ))}
        </View>
    );
};

export default HomeSkeleton;

const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 10,
    },
    container: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleSkeleton: {
        height: 24,
        width: 150,
        backgroundColor: COLORS.LIGHT_GRAY || '#E0E0E0',
        borderRadius: 6,
    },
    viewAllSkeleton: {
        height: 20,
        width: 60,
        backgroundColor: COLORS.LIGHT_GRAY || '#E0E0E0',
        borderRadius: 4,
    },
    cardsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    cardSkeleton: {
        width: 160,
        backgroundColor: COLORS.WHITE,
        borderRadius: 14,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    imageSkeleton: {
        width: '100%',
        height: 140,
        backgroundColor: COLORS.LIGHT_GRAY || '#E0E0E0',
    },
    cardContent: {
        padding: 12,
    },
    titleLineSkeleton: {
        height: 12,
        backgroundColor: COLORS.LIGHT_GRAY || '#E0E0E0',
        borderRadius: 4,
        marginBottom: 8,
        width: '80%',
    },
    priceSkeleton: {
        height: 16,
        backgroundColor: COLORS.LIGHT_GRAY || '#E0E0E0',
        borderRadius: 4,
        marginTop: 8,
        marginBottom: 12,
        width: '40%',
    },
    buttonSkeleton: {
        height: 36,
        backgroundColor: COLORS.LIGHT_GRAY || '#E0E0E0',
        borderRadius: 8,
        width: '100%',
    },
});
