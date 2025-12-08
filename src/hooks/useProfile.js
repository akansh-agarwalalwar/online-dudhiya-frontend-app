import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

// Mock API service - replace with actual API calls
const ProfileAPI = {
  getUserProfile: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+91 9876543210',
          image: null,
          stats: {
            orders: 12,
            wishlist: 8,
            reviews: 24,
          },
        });
      }, 1000);
    });
  },
  
  updateUserProfile: async (profileData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: profileData });
      }, 500);
    });
  },
};

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Load user profile
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await ProfileAPI.getUserProfile();
      setProfile(userData);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (newData) => {
    try {
      setUpdating(true);
      const result = await ProfileAPI.updateUserProfile(newData);
      
      if (result.success) {
        setProfile(result.data);
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
  const refreshProfile = () => {
    loadProfile();
  };

  // Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

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