import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/common/ScreenWrapper';
import AppHeader from '../components/common/AppHeader';
import COLORS from '../constants/Color';
import { useNavigation } from '@react-navigation/native';

const ReturnPolicy = () => {
    const navigation = useNavigation();

    return (
        <ScreenWrapper topSafeArea={false} backgroundColor={COLORS.BACKGROUND}>
            <AppHeader
                title="Return Policy"
                showBack={true}
                onBackPress={() => navigation.goBack()}
            />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    <Text style={styles.paragraph}>
                        At Online Dhudhiya, we are committed to providing you with the freshest and highest quality dairy products. If you are not satisfied with your purchase, we are here to help.
                    </Text>

                    <Text style={styles.sectionTitle}>1. Returns and Refunds</Text>
                    <Text style={styles.paragraph}>
                        Due to the perishable nature of dairy products, we generally do not accept returns. However, if you receive a damaged, spoiled, or incorrect item, please contact us within 24 hours of delivery.
                    </Text>

                    <Text style={styles.sectionTitle}>2. Eligibility for Refunds</Text>
                    <Text style={styles.paragraph}>
                        To be eligible for a refund or replacement:
                        {'\n'}- You must report the issue within 24 hours of delivery.
                        {'\n'}- You may be asked to provide photographic evidence of the damaged or spoiled product.
                        {'\n'}- The item must be in its original packaging (if applicable).
                    </Text>

                    <Text style={styles.sectionTitle}>3. Process for Reporting Issues</Text>
                    <Text style={styles.paragraph}>
                        Please contact our customer support team via the 'Help & Support' section in the app or email us at support@onlinedhudhiya.com. Include your order number and details of the issue.
                    </Text>

                    <Text style={styles.sectionTitle}>4. Refund Method</Text>
                    <Text style={styles.paragraph}>
                        Approved refunds will be processed to your original method of payment or provided as store credit (Wallet balance) within 5-7 business days.
                    </Text>

                    <Text style={styles.sectionTitle}>5. Cancellations</Text>
                    <Text style={styles.paragraph}>
                        You can cancel your order before it has been dispatched for delivery. Once the order is out for delivery, it cannot be cancelled.
                    </Text>

                    <Text style={styles.sectionTitle}>6. Contact Us</Text>
                    <Text style={styles.paragraph}>
                        If you have any questions about our Return Policy, please contact us at support@onlinedhudhiya.com.
                    </Text>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>© 2024 Online Dhudhiya. All rights reserved.</Text>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 30,
    },
    contentContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.DARK,
        marginTop: 20,
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 24,
        color: '#555',
        marginBottom: 10,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    footerText: {
        fontSize: 12,
        color: COLORS.GRAY,
    },
});

export default ReturnPolicy;
