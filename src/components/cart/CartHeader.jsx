import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import COLORS from '../../constants/Color';

const CartHeader = ({ 
  onBackPress = () => {}, 
  onClearCart = () => {},
  itemCount = 0 
}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <ArrowLeft size={24} color={COLORS.DARK} />
      </TouchableOpacity>
      
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>Cart</Text>
        {itemCount > 0 && (
          <Text style={styles.itemCount}>({itemCount} item{itemCount > 1 ? 's' : ''})</Text>
        )}
      </View>
      
      {itemCount > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={onClearCart}>
          <Trash2 size={20} color={COLORS.ERROR} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.DARK,
    textAlign: 'center',
  },
  itemCount: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginTop: 2,
  },
  clearButton: {
    padding: 8,
    marginRight: -8,
  },
});

export default CartHeader;