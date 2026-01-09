import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import userService from '../services/userService';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const { isGuest, isAuthenticated } = useSelector((state) => state.auth);

  // Load user profile
  const loadProfile = async (showLoading = true) => {
    if (isGuest || !isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      if (showLoading) setLoading(true);
      setError(null);
      console.log('🔍 Fetching user profile...');
      const response = await userService.getMe();
      console.log('✅ Profile API response:', response);
      // Backend returns: { data: { user: {...} } }
      const userData = response.data?.user || response.data;
      console.log('✅ Profile data extracted:', userData);
      setProfile(userData);
    } catch (err) {
      console.error('❌ Failed to load profile:', err);
      const errorMessage = err.message || 'Failed to load profile';
      setError(errorMessage);

      // Only show alert if it's not an authentication error
      if (!err.message?.includes('401') && !err.message?.includes('unauthorized')) {
        Alert.alert('Error', 'Failed to load profile data');
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (newData) => {
    try {
      setUpdating(true);
      const response = await userService.updateMe(newData);

      // Backend returns: { data: { user: {...} } }
      const userData = response.data?.user || response.data;
      if (userData) {
        setProfile(userData);
        Alert.alert('Success', 'Profile updated successfully');
        return true;
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      Alert.alert('Error', 'Failed to update profile');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    await loadProfile(false);
  };

  // Load profile on component mount
  useEffect(() => {
    if (isAuthenticated && !isGuest) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [isGuest, isAuthenticated]);

  return {
    profile,
    loading,
    error,
    updating,
    updateProfile,
    refreshProfile,
    loadProfile,
  };
};

export default useProfile;