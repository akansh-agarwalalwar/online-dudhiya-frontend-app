import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Package, Heart, Star } from 'lucide-react-native';
import COLORS from '../../constants/Color';

const ProfileStats = ({
  stats = [
    { label: 'Orders', value: '12', icon: Package },
    { label: 'Wishlist', value: '8', icon: Heart },
    { label: 'Reviews', value: '24', icon: Star },
  ]
}) => {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <View key={index} style={[styles.statItem, index === stats.length - 1 && styles.lastStatItem]}>
            {IconComponent && <IconComponent size={20} color={COLORS.PRIMARY} strokeWidth={2} />}
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    paddingVertical: 20,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: COLORS.LIGHT_GRAY,
    paddingVertical: 4,
  },
  lastStatItem: {
    borderRightWidth: 0,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
});

export default ProfileStats;