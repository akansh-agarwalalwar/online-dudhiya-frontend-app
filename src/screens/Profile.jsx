import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
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

const Profile = ({ navigation }) => {
  const { profile, loading, updating, refreshProfile } = useProfile();

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
    Alert.alert('Support', 'Support screen will be implemented here.');
  };

  const handleAbout = () => {
    Alert.alert('About', 'About screen will be implemented here.');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy will be shown here.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          // Implement logout logic here
          console.log('User logged out');
        }},
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Profile Header */}
        <ProfileHeader
          userImage={profile.image}
          userName={profile.name}
          userEmail={profile.email}
          userPhone={profile.phone}
          onEditPress={handleEditProfile}
        />

        {/* Profile Stats */}
        <ProfileStats 
          stats={[
            { label: 'Orders', value: profile.stats?.orders?.toString() || '0', icon: Package },
            { label: 'Wishlist', value: profile.stats?.wishlist?.toString() || '0', icon: Heart },
            { label: 'Reviews', value: profile.stats?.reviews?.toString() || '0', icon: Star },
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
            badgeText="3"
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
    </SafeAreaView>
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