import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Truck, MapPin } from 'lucide-react-native';
import COLORS from '../../constants/Color';

const DeliveryToggle = ({ 
  selectedOption = 'delivery', 
  onOptionChange = () => {},
  deliveryAddress = '123 MG Road, Delhi, India 110001'
}) => {
  const options = [
    {
      id: 'delivery',
      title: 'Delivery',
      icon: Truck,
    },
    {
      id: 'pickup',
      title: 'Pickup',
      icon: MapPin,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        {options.map((option) => {
          const IconComponent = option.icon;
          const isSelected = selectedOption === option.id;
          
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.toggleButton,
                isSelected && styles.selectedToggleButton,
              ]}
              onPress={() => onOptionChange(option.id)}
              activeOpacity={0.7}
            >
              <IconComponent 
                size={18} 
                color={isSelected ? COLORS.WHITE : COLORS.PRIMARY} 
              />
              <Text 
                style={[
                  styles.toggleText,
                  isSelected && styles.selectedToggleText,
                ]}
              >
                {option.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {selectedOption === 'delivery' && (
        <TouchableOpacity style={styles.addressContainer}>
          <Text style={styles.addressText}>{deliveryAddress}</Text>
          <Text style={styles.changeText}>change</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 25,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 21,
    backgroundColor: 'transparent',
  },
  selectedToggleButton: {
    backgroundColor: COLORS.PRIMARY,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginLeft: 8,
  },
  selectedToggleText: {
    color: COLORS.WHITE,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingVertical: 8,
  },
  addressText: {
    fontSize: 16,
    color: COLORS.DARK,
    flex: 1,
  },
  changeText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
});

export default DeliveryToggle;