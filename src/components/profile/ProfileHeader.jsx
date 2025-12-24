import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Edit2 } from 'lucide-react-native';
import COLORS from '../../constants/Color';

const { width } = Dimensions.get('window');

const ProfileHeader = ({
  userImage = '',
  userName = 'John Doe',
  // userEmail = 'john.doe@example.com',
  userPhone = '+91 9876543210',
  onEditPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundGradient} />

      <View style={styles.contentContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            {userImage ? (
              <Image source={{ uri: userImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Image
                  source={{ uri: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png' }}
                  style={styles.avatar}
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={onEditPress}
            activeOpacity={0.7}
          >
            <Edit2 size={16} color={COLORS.WHITE} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          {/* <Text style={styles.userEmail}>{userEmail}</Text> */}
          <Text style={styles.userPhone}>+91 {userPhone}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingBottom: 20,
    marginBottom: 10,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: COLORS.PRIMARY,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  contentContainer: {
    paddingTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.WHITE,
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    backgroundColor: COLORS.ACCENT_ORANGE,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.GRAY,
    marginBottom: 2,
    textAlign: 'center',
  },
  userPhone: {
    fontSize: 14,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
});

export default ProfileHeader;