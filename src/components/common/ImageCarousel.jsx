import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import COLORS from "../../constants/Color";

const { width } = Dimensions.get("window");

const ImageCarousel = ({
  data = [],
  autoPlay = true,
  interval = 5000,
  height = 150,
  onPressItem = () => {},
}) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto Play Logic
  useEffect(() => {
    if (!autoPlay || data.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % data.length;
        
        try {
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        } catch (error) {
          console.warn('ScrollToIndex error:', error);
        }
        
        return nextIndex;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, data.length, interval]);

  // Render Each Image Slide
  const renderItem = ({ item }) => (
    <View style={styles.slideContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPressItem(item)}
        style={styles.imageContainer}
      >
        <Image
          source={typeof item === "string" ? { uri: item } : item}
          style={[styles.image, { height }]}
          resizeMode="stretch"
        />
      </TouchableOpacity>
    </View>
  );

  // Pagination Dots
  const PaginationDots = () => (
    <View style={styles.paginationWrapper}>
      {data.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / width
          );
          console.log('Scroll ended - Index:', index, 'Offset:', e.nativeEvent.contentOffset.x);
          setCurrentIndex(index);
        }}
        onScrollEndDrag={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
      />

      {data.length > 1 && <PaginationDots />}
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    position: 'relative',
    marginVertical: 10,
  },

  slideContainer: {
    width: width,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageContainer: {
    width: '100%',
  },

  image: {
    width: "100%",
    borderRadius: 32,
    backgroundColor: '#f0f0f0', // Placeholder background while loading
  },

  paginationWrapper: {
    flexDirection: "row",
    marginTop: 8,

    alignSelf: "center",
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(44, 44, 44, 0.6)",
    marginHorizontal: 3,
  },

  activeDot: {
    backgroundColor: COLORS.PRIMARY || "#1ea6ff",
    width: 24,
    height: 8,
    borderRadius: 4,
  },
});

export default ImageCarousel;
