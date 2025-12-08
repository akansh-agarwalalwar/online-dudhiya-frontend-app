import React, { useState, useRef } from 'react';
import { View, Image, FlatList, Dimensions, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import COLORS from '../../../constants/Color';

const FallbackImage = ({ width, height, style }) => (
  <View style={[{
    width: width || 60,
    height: height || 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  }, style]}>
    <Text style={{ fontSize: Math.min((width || 60) / 8, 12), color: '#999', textAlign: 'center' }}>
      No{'\n'}Image
    </Text>
  </View>
);

const { width } = Dimensions.get('window');

const ImageCarousel = ({ images }) => {
  const [imageErrors, setImageErrors] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleImageLoad = (index) => {
    console.log(`Image loaded successfully at index ${index}`);
    setImageLoading(prev => ({ ...prev, [index]: false }));
    setImageErrors(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index) => {
    console.log(`Image failed to load at index ${index}:`, images[index]);
    setImageErrors(prev => ({ ...prev, [index]: true }));
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleImageLoadStart = (index) => {
    setImageLoading(prev => ({ ...prev, [index]: true }));
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageNum);
  };

  const handleThumbnailPress = (index) => {
    setCurrentIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const renderThumbnail = ({ item, index }) => {
    const imageSource = item.source ? item.source : (item.uri ? { uri: item.uri } : null);
    const isSelected = index === currentIndex;
    
    return (
      <TouchableOpacity 
        onPress={() => handleThumbnailPress(index)}
        style={{
          marginHorizontal: 4,
          borderWidth: 2,
          borderColor: isSelected ? `${COLORS.PRIMARY}` : 'transparent',
          borderRadius: 6,
        }}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={{
              width: 60,
              height: 60,
              borderRadius: 4,
              resizeMode: 'cover',
            }}
          />
        ) : (
          <FallbackImage width={60} height={60} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ backgroundColor: '#f5f5f5' }}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          // Determine the image source - either local (require) or remote (uri)
          const imageSource = item.source ? item.source : (item.uri ? { uri: item.uri } : null);
          
          // Debug logging
          console.log(`Rendering image ${index}:`, { item, imageSource });
          
          return (
            <View style={{ width: width, height: 260, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
              {imageErrors[index] || !imageSource ? (
                <FallbackImage 
                  width={width * 0.8} 
                  height={200}
                  style={{ backgroundColor: '#e8e8e8' }}
                />
              ) : (
                <>
                  <Image
                    source={imageSource}
                    style={{ width: width, height: 260, resizeMode: 'contain' }}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                    onLoadStart={() => handleImageLoadStart(index)}
                  />
                  {imageLoading[index] && (
                    <View style={{ 
                      position: 'absolute', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      backgroundColor: 'rgba(255,255,255,0.8)'
                    }}>
                      <ActivityIndicator size="large" color="#ff4d4d" />
                    </View>
                  )}
                </>
              )}
            </View>
          );
        }}
      />
      
      {/* Thumbnail strip at the bottom */}
      <View style={{ 
        paddingVertical: 10, 
        paddingHorizontal: 16,
        backgroundColor: '#fff'
      }}>
        <FlatList
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `thumb_${index}`}
          renderItem={renderThumbnail}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      </View>
    </View>
  );
};

export default ImageCarousel;
