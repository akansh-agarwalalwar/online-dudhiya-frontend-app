import React, { useEffect, useRef } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, Animated, StatusBar } from 'react-native';
import ScreenWrapper from '../components/common/ScreenWrapper';
import LinearGradient from 'react-native-linear-gradient';

const Splash = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }, [opacity, scale]);

  return (
    <ScreenWrapper topSafeArea={false} bottomSafeArea={true}>
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
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={styles.gradient}
        >
          <Text style={styles.subtitle1}>Powered By Rural Area Student Group</Text>
        </LinearGradient>
      </ImageBackground>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1ea6ff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
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
  subtitle1: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 4,
    textAlign: 'center',
    backgroundColor: 'rgb(0,0,0,0.4)',
    color: '#e6f7ff',
    fontSize: 16,
    marginTop: 2,
    position: 'absolute',
    bottom: 0,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Splash;