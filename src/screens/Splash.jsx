import React, { useEffect, useRef } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, Animated, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Splash = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const navigation = useNavigation();
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      if (token) {
        navigation.replace('MainTabs');
      } else {
        navigation.replace('AuthStack');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [opacity, scale, navigation, token]);

  return (
    <ImageBackground
      source={require('../assets/images/backgrounds/splash.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Animated.View style={[styles.logoWrap, { opacity, transform: [{ scale }] }]}>
        <Image
          source={require('../assets/images/logos/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Online Dudhiya</Text>
        <Text style={styles.subtitle}>From farm to direct UR Home</Text>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1ea6ff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoWrap: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 200,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#e6f7ff',
    fontSize: 12,
    marginTop: 6,
  },
});

export default Splash;