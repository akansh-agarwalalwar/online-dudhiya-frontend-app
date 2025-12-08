import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import COLORS from '../../constants/Color';

const ProfileSection = ({
  title,
  children,
  containerStyle,
  showTitle = true,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {showTitle && title && (
        <Text style={styles.sectionTitle}>{title}</Text>
      )}
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  sectionContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
});

export default ProfileSection;