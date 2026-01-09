import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import COLORS from '../../../constants/Color';

const { width } = Dimensions.get('window');

const BannerSkeleton = () => {
    return (
        <View style={styles.container}>
            <SkeletonPlaceholder
                borderRadius={16}
                backgroundColor={COLORS.LIGHT_GRAY}
                highlightColor={COLORS.WHITE}
                speed={1000}
            >
                <View style={styles.skeletonItem} />
            </SkeletonPlaceholder>
        </View>
    );
};

export default BannerSkeleton;

const styles = StyleSheet.create({
    container: {
        width: width,
        paddingHorizontal: 16,
        marginVertical: 12,
    },
    skeletonItem: {
        width: '100%',
        height: 150,
        borderRadius: 16,
    },
});
