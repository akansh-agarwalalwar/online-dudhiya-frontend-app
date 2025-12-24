import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Truck, Shield, RefreshCw } from 'lucide-react-native';
import AccordionItem from '../core/product/AccordionItem';

/**
 * ProductDetailsSection Component
 * Displays product details in accordion format with delivery info
 */
const ProductDetailsSection = ({ product }) => {
  if (!product) return null;

  const {
    description,
    productComposition,
    usesIndications,
    howToUse,
    howItWorks,
    sideEffects,
    expertAdvice,
    medicineInteraction,
    alcoholInteraction,
    pregnancyInteraction,
    interactionsWarnings,
    faq,
    isReturnable,
  } = product;

  return (
    <View style={styles.container}>
      {/* Delivery & Return Info */}
      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Truck size={24} color="#4CAF50" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Fast Delivery</Text>
            <Text style={styles.infoSubtitle}>Delivered within 24-48 hours</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Shield size={24} color="#2196F3" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Quality Assured</Text>
            <Text style={styles.infoSubtitle}>100% Genuine Products</Text>
          </View>
        </View>

        {isReturnable && (
          <View style={styles.infoCard}>
            <RefreshCw size={24} color="#FF9800" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Easy Returns</Text>
              <Text style={styles.infoSubtitle}>Return within 7 days</Text>
            </View>
          </View>
        )}
      </View>

      {/* Product Description */}
      {description && (
        <AccordionItem
          title="About the Product"
          content={description}
          defaultExpanded={true}
        />
      )}

      {/* Composition */}
      {productComposition && (
        <AccordionItem
          title="Composition"
          content={productComposition}
        />
      )}

      {/* Uses & Indications */}
      {usesIndications && (
        <AccordionItem
          title="Uses & Benefits"
          content={usesIndications}
        />
      )}

      {/* How to Use */}
      {howToUse && (
        <AccordionItem
          title="How to Use"
          content={howToUse}
        />
      )}

      {/* How it Works */}
      {howItWorks && (
        <AccordionItem
          title="How it Works"
          content={howItWorks}
        />
      )}

      {/* Side Effects */}
      {sideEffects && (
        <AccordionItem
          title="Side Effects"
          content={sideEffects}
        />
      )}

      {/* Expert Advice */}
      {expertAdvice && (
        <AccordionItem
          title="Expert Advice"
          content={expertAdvice}
        />
      )}

      {/* Medicine Interaction */}
      {medicineInteraction && (
        <AccordionItem
          title="Drug Interactions"
          content={medicineInteraction}
        />
      )}

      {/* Alcohol Interaction */}
      {alcoholInteraction && (
        <AccordionItem
          title="Alcohol Interaction"
          content={alcoholInteraction}
        />
      )}

      {/* Pregnancy Interaction */}
      {pregnancyInteraction && (
        <AccordionItem
          title="Pregnancy & Breastfeeding"
          content={pregnancyInteraction}
        />
      )}

      {/* Warnings */}
      {interactionsWarnings && (
        <AccordionItem
          title="Warnings & Precautions"
          content={interactionsWarnings}
        />
      )}

      {/* FAQ */}
      {faq && (
        <AccordionItem
          title="Frequently Asked Questions"
          content={faq}
        />
      )}
    </View>
  );
};

export default ProductDetailsSection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  infoSection: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 12,
    color: '#666',
  },
});
