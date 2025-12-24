import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SkeletonCard = () => {
    return (
        <View style={styles.cardContainer}>
            <LinearGradient
                colors={['#e0e0e0', '#f5f5f5', '#e0e0e0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.skeleton}
            >
                {/* Image skeleton */}
                <View style={styles.imageSkeleton} />

                {/* Title skeleton */}
                <View style={styles.titleSkeleton} />
                <View style={[styles.titleSkeleton, { width: '60%' }]} />

                {/* Price skeleton */}
                <View style={styles.priceSkeleton} />

                {/* Button skeleton */}
                <View style={styles.buttonSkeleton} />
            </LinearGradient>
        </View>
    );
};

export default SkeletonCard;

const styles = StyleSheet.create({
    cardContainer: {
        width: 180,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 10,
        margin: 10,
        height: 280,
        elevation: 4,
        overflow: 'hidden',
    },
    skeleton: {
        flex: 1,
        borderRadius: 10,
    },
    imageSkeleton: {
        width: '100%',
        height: 150,
        backgroundColor: '#d0d0d0',
        borderRadius: 10,
        marginBottom: 8,
    },
    titleSkeleton: {
        height: 14,
        backgroundColor: '#d0d0d0',
        borderRadius: 4,
        marginBottom: 6,
        width: '80%',
    },
    priceSkeleton: {
        height: 16,
        backgroundColor: '#d0d0d0',
        borderRadius: 4,
        marginTop: 8,
        width: '40%',
    },
    buttonSkeleton: {
        height: 32,
        backgroundColor: '#d0d0d0',
        borderRadius: 8,
        marginTop: 12,
        width: '100%',
    },
});
