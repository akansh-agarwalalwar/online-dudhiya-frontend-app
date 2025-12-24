import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import {
  Package,
  MapPin,
  Heart,
  CreditCard,
  Bell,
  Shield,
  MessageCircle,
  Info,
  LogOut,
  Star,
} from 'lucide-react-native';
import COLORS from '../constants/Color';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileSection from '../components/profile/ProfileSection';
import ProfileMenuItem from '../components/profile/ProfileMenuItem';
import ProfileStats from '../components/profile/ProfileStats';
import LoadingScreen from '../components/common/LoadingScreen';
import useProfile from '../hooks/useProfile';
import ScreenWrapper from '../components/common/ScreenWrapper';

import { logout } from '../redux/slices/authSlice';
import authService from '../services/authService';

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profile, loading, updating, refreshProfile } = useProfile();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshProfile();
    setRefreshing(false);
  }, [refreshProfile]);

  console.log(profile);

  // Navigation handlers
  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { profile, refreshProfile });
  };

  const handleMyOrders = () => {
    navigation.navigate('MyOrders');
  };

  const handleAddresses = () => {
    navigation.navigate('ManageAddress');
  };

  const handleWishlist = () => {
    navigation.navigate('Wishlist')
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Notifications settings will be implemented here.');
  };

  const handlePaymentMethods = () => {
    Alert.alert('Payment Methods', 'Payment methods screen will be implemented here.');
  };

  const handleSupport = () => {
    navigation.navigate('HelpAndSupport');
  };

  const handleAbout = () => {
    navigation.navigate('About');
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout', style: 'destructive', onPress: async () => {
            try {
              // 1. Clear local storage & API logout
              await authService.logout();

              // 2. Clear Redux state (this will trigger navigation switch in AppNavigator)
              dispatch(logout());
            } catch (error) {
              console.error('Logout error:', error);
              // Force logout in Redux even if API fails
              dispatch(logout());
            }
          }
        },
      ]
    );
  };

  // Show loading screen while profile data is loading
  if (loading) {
    return <LoadingScreen />;
  }

  // Don't render if no profile data
  if (!profile) {
    return <LoadingScreen />;
  }

  return (
    <ScreenWrapper topSafeArea={false} bottomSafeArea={true} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Profile Header */}
        <ProfileHeader
          userImage={profile.profile_picture}
          userName={profile.name}
          userEmail={profile.email}
          userPhone={profile.phone_number
          }
          onEditPress={handleEditProfile}
        />

        {/* Profile Stats */}
        <ProfileStats
          stats={[
            { label: 'Orders', value: profile?.activeOrdersCount, icon: Package },
            { label: 'Wishlist', value: profile?.wishlistCount, icon: Heart },
            { label: 'Reviews', value: profile?.reviews?.toString() || '0', icon: Star },
          ]}
        />

        {/* Account Section */}
        <ProfileSection title="Account">
          <ProfileMenuItem
            IconComponent={Package}
            title="My Orders"
            subtitle="Check your order status"
            onPress={handleMyOrders}
            showBadge={true}
            badgeText={profile?.activeOrdersCount}
          />
          <ProfileMenuItem
            IconComponent={MapPin}
            title="My Addresses"
            subtitle="Manage delivery addresses"
            onPress={handleAddresses}
          />
          <ProfileMenuItem
            IconComponent={Heart}
            title="Wishlist"
            subtitle="Your favorite products"
            onPress={handleWishlist}
            iconBackgroundColor="#FFE5E5"
            iconColor={COLORS.ERROR}
          />
          <ProfileMenuItem
            IconComponent={CreditCard}
            title="Payment Methods"
            subtitle="Manage your payment options"
            onPress={handlePaymentMethods}
            isLast={true}
            iconBackgroundColor="#E8F5E8"
            iconColor={COLORS.ACCENT_GREEN}
          />
        </ProfileSection>

        {/* Settings Section */}
        <ProfileSection title="Settings">
          <ProfileMenuItem
            IconComponent={Bell}
            title="Notifications"
            subtitle="Push notifications, SMS & emails"
            onPress={handleNotifications}
            iconBackgroundColor="#FFF3E0"
            iconColor={COLORS.ACCENT_ORANGE}
          />
          <ProfileMenuItem
            IconComponent={Shield}
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={handlePrivacyPolicy}
          />
          <ProfileMenuItem
            IconComponent={Shield}
            title="Terms & Conditions"
            subtitle="Read our terms of service"
            onPress={() => navigation.navigate('TermsAndConditions')}
          />
          <ProfileMenuItem
            IconComponent={Shield}
            title="Return Policy"
            subtitle="Read our return policy"
            onPress={() => navigation.navigate('ReturnPolicy')}
            isLast={true}
          />
        </ProfileSection>

        {/* Support Section */}
        <ProfileSection title="Support">
          <ProfileMenuItem
            IconComponent={MessageCircle}
            title="Help & Support"
            subtitle="Get help or contact us"
            onPress={handleSupport}
          />
          <ProfileMenuItem
            IconComponent={Info}
            title="About"
            subtitle="Learn more about Online Dhudhiya"
            onPress={handleAbout}
            isLast={true}
          />
        </ProfileSection>

        {/* Logout Section */}
        <ProfileSection showTitle={false}>
          <ProfileMenuItem
            IconComponent={LogOut}
            title="Logout"
            subtitle="Sign out from your account"
            onPress={handleLogout}
            showArrow={false}
            isLast={true}
            iconBackgroundColor="#FFE5E5"
            iconColor={COLORS.ERROR}
          />
        </ProfileSection>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default Profile;