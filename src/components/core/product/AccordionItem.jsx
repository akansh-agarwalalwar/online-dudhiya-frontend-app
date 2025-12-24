import React, { useState } from 'react';
import { TouchableOpacity, View, Text, LayoutAnimation, StyleSheet } from 'react-native';
import { Plus, Minus } from 'lucide-react-native'; // Correct import

const AccordionItem = ({ title, content, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => {
    LayoutAnimation.easeInEaseOut();
    setOpen(!open);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.header} onPress={toggle}>
        <Text style={styles.title}>{title}</Text>
        {open ? <Minus size={20} /> : <Plus size={20} />}
      </TouchableOpacity>

      {open && (
        <Text style={styles.content}>{content}</Text>
      )}
    </View>
  );
};

export default AccordionItem;

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: { fontSize: 15, fontWeight: '600' },
  content: { marginTop: 10, color: '#555', lineHeight: 20 },
});
