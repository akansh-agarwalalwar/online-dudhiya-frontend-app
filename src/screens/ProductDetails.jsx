import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

import ProductHeader from '../components/common/AppHeader';
import ImageCarousel from '../components/core/product/ImageCarousel';
import AccordionItem from '../components/core/product/AccordionItem';
import { Star, Truck } from 'lucide-react-native';
import ScreenWrapper from '../components/common/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../constants/Color';

const CircularRating = ({ value, label, count }) => (
  <View style={styles.circleBox}>
    <View style={styles.circleOuter}>
      <View style={[styles.circleInner, { borderColor: '#5cb85c', borderWidth: 4 }]}>
        <Text style={styles.circleValue}>{value}</Text>
      </View>
    </View>
    <Text style={styles.circleLabel}>{label}</Text>
    <Text style={styles.circleCount}>{count} ratings</Text>
  </View>
);

const ProductDetailsScreen = () => {
  const [showShadow, setShowShadow] = useState(false);

  const navigation = useNavigation();
  
  const images = [
    {uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXqDp24u0vJ2kU0cmGmIM9fhGnpjTSlxonLA&s'},
    { source: require('../assets/images/product/milk.png') },
    { uri: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/02/Glass-and-bottle-of-milk-fe0997a.jpg?resize=1366,1366' },
    { uri: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=465&q=80' },
  ];

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowShadow(scrollY > 10);
  };

  return (
    <ScreenWrapper bottomSafeArea={true} topSafeArea={false} style={styles.container}>
      <ProductHeader title="English Short Bread" showBack={true} onBackPress={() => navigation.goBack()} />

      {/* Sticky Product Title + Price */}
      <View style={[styles.stickyHeaderSection, showShadow && styles.stickyHeaderShadow]}>
        <Text style={styles.productName}>English Short Bread - Vanilla, 150 g</Text>
        <View style={styles.priceRow}>
          <Text style={styles.mainPrice}>₹139</Text>
          <Text style={styles.strikePrice}>₹155</Text>
          <Text style={styles.off}>₹16 OFF</Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="normal"
        bounces={true}
        bouncesZoom={false}
        alwaysBounceVertical={false}
        scrollToOverflowEnabled={false}
        nestedScrollEnabled={true}
      >
        
        {/* Image Carousel */}
        <ImageCarousel images={images} />

        {/* Ratings */}
        <View style={styles.ratingBox}>
          <Text style={styles.rating}>3.5 <Star size={20} backgroundColor={'#f5e52fff'} color={'#f5e52fff'}/></Text>
          <Text style={styles.reviewCount}>413 Ratings & 33 Reviews</Text>
        </View>

        {/* Tomorrow Morning Delivery */}
        <View style={styles.deliveryBox}>
          <Truck size={24} color={'#173945ff'} />
          <Text style={styles.deliveryText}> Tomorrow Morning Delivery</Text> 
        </View>

        {/* Accordions for Product Info */}
        
        <AccordionItem
          title="About the Product"
          content="Fresho Signature is an artisanal bakery brand that creates premiere products by expert bakers."
        />

        <AccordionItem
          title="Ingredients"
          content="Refined Wheat Flour, Butter, Icing Sugar, Corn Flour, Edible Common Salt, Potassium."
        />

        <AccordionItem
          title="Nutritional Facts"
          content={`Energy: 501 kcal\nCarbs: 62g\nSugar: 21.1g\nFat: 24g`}
        />

        <AccordionItem
          title="Other Product Info"
          content={`EAN Code: 400555360001\nCountry of Origin: India`}
        />
        
        {/* Ratings & Reviews */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Ratings & Reviews</Text>
          <View style={styles.ratingRowMain}>
            <Text style={styles.ratingMainValue}>3.5</Text>
            <Star size={32} color="#b2b85cff" style={{ marginLeft: 4 }} />
          </View>
          <Text style={styles.ratingCount}>414 ratings & 33 reviews</Text>
        </View>

        {/* Highlights */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Highlights</Text>
          <View style={styles.ratingRow}>
            <CircularRating value="3" label="Taste" count="57" />
            <CircularRating value="3.4" label="Packaging & Presentation" count="55" />
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Footer Buy */}
      <View style={styles.bottomBar}>
        {/* <TouchableOpacity style={styles.buyOnceBtn}>
          <Text style={styles.buyText}>BUY ONCE</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.subscribeBtn}>
          <Text style={styles.subscribeText}>Add To Bag @ ₹139</Text>
        </TouchableOpacity>
      </View>

    </ScreenWrapper>
  );
};

export default ProductDetailsScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' ,position: 'relative'},

  stickyHeaderSection: { 
    padding: 16, 
    marginTop:-10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 10,
  },
  stickyHeaderShadow: {
    elevation: 2,
    shadowColor: '#0000003d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.005,
    shadowRadius: 8,
  },
  scrollView: { flex: 1 },
  productName: { fontSize: 18, fontWeight: '600', color: '#222' },

  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  mainPrice: { fontSize: 20, fontWeight: '700', color: '#000' },
  strikePrice: {
    fontSize: 16,
    marginLeft: 8,
    textDecorationLine: 'line-through',
    color: '#777',
  },
  off: { fontSize: 16, marginLeft: 8, color: 'red', fontWeight: '600' },

  taxText: { fontSize: 12, color: '#777', marginTop: 4 },

  ratingBox: { padding: 16 },
  rating: { fontSize: 20, fontWeight: '700', color: '#222' ,flexDirection: 'row', alignItems: 'center', gap: 4 },
  reviewCount: { color: '#555', marginTop: 4 },

  deliveryBox: { padding: 16, backgroundColor: '#f4f4f4',display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 },
  deliveryText: { fontSize: 14, color: '#444',flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingSection: { padding: 16, backgroundColor: '#fff' },
  ratingTitle: { fontSize: 18, fontWeight: '600', color: '#222', marginBottom: 8 },
  ratingRowMain: { flexDirection: 'row', alignItems: 'center' },
  ratingMainValue: { fontSize: 36, fontWeight: '700', color: '#b8b25cff' },
  ratingCount: { color: '#555', marginTop: 4, fontSize: 16 },

  summarySection: { padding: 16 },
  summaryTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },

  ratingRow: { flexDirection: 'row', marginTop: 12 },
  circleBox: { alignItems: 'center', marginRight: 40 },
  circleOuter: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#e0e0e0',
    borderWidth: 2,
  },
  circleValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5cb85c',
  },
  circleLabel: { marginTop: 6, color: '#444', fontSize: 14 },
  circleCount: { marginTop: 2, color: '#888', fontSize: 12 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  buyOnceBtn: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeBtn: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  subscribeText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
