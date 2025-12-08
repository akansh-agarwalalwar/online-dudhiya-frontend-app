import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import COLORS from '../../constants/Color';

const { width } = Dimensions.get('window');

const ProfileMenuItem = ({
  IconComponent,
  title,
  subtitle,
  onPress,
  showArrow = true,
  showBadge = false,
  badgeText,
  isLast = false,
  iconBackgroundColor = COLORS.PRIMARY_LIGHT,
  iconColor = COLORS.PRIMARY,
  iconSize = 20,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, !isLast && styles.borderBottom]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
          {IconComponent && (
            <IconComponent 
              size={iconSize} 
              color={iconColor}
              strokeWidth={2}
            />
          )}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.rightContent}>
        {showBadge && badgeText && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
        
        {showArrow && (
          <ChevronRight size={16} color={COLORS.GRAY} strokeWidth={2} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.WHITE,
    minHeight: 64,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.GRAY,
    lineHeight: 16,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: COLORS.ERROR,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },

});

export default ProfileMenuItem;