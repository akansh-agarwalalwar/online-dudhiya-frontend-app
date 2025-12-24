import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = 350;
const THUMBNAIL_SIZE = 60;

/**
 * ProductImageGallery Component
 * Displays a main image carousel with thumbnail navigation
 */
const ProductImageGallery = ({ images = [], fallbackImage }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const scrollViewRef = useRef(null);

  // Handle empty images array
  const imageList = images.length > 0 
    ? images 
    : [fallbackImage || require('../../assets/images/product/milk.png')];

  // Handle scroll to update active index
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  // Handle thumbnail press
  const handleThumbnailPress = (index) => {
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
  };

  // Render image source
  const getImageSource = (image) => {
    if (typeof image === 'string') {
      return { uri: image };
    }
    if (image?.uri) {
      return { uri: image.uri };
    }
    if (image?.source) {
      return image.source;
    }
    return require('../../assets/images/product/milk.png');
  };

  return (
    <View style={styles.container}>
      {/* Main Image Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.imageCarousel}
      >
        {imageList.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            {imageLoading && (
              <ActivityIndicator
                size="large"
                color="#00cd5c"
                style={styles.loader}
              />
            )}
            <Image
              source={getImageSource(image)}
              style={styles.mainImage}
              resizeMode="contain"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      {imageList.length > 1 && (
        <View style={styles.pagination}>
          {imageList.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}

      {/* Thumbnail Navigation */}
      {imageList.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailContainer}
        >
          {imageList.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleThumbnailPress(index)}
              style={[
                styles.thumbnail,
                index === activeIndex && styles.activeThumbnail,
              ]}
            >
              <Image
                source={getImageSource(image)}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ProductImageGallery;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  imageCarousel: {
    height: IMAGE_HEIGHT,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  mainImage: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#00cd5c',
    width: 24,
  },
  thumbnailContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 8,
  },
  activeThumbnail: {
    borderColor: '#00cd5c',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});
