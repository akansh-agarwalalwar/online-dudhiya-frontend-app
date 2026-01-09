import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/common/ScreenWrapper';
import AppHeader from '../components/common/AppHeader';
import COLORS from '../constants/Color';
import { useNavigation } from '@react-navigation/native';

const TermsAndConditions = () => {
    const navigation = useNavigation();

    return (
        <ScreenWrapper topSafeArea={false} backgroundColor={COLORS.BACKGROUND}>
            <AppHeader
                title="Terms & Conditions"
                showBack={true}
                onBackPress={() => navigation.goBack()}
            />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    <Text style={styles.paragraph}>
                        Welcome to Online Dhudhiya. By accessing or using our mobile application and services, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.
                    </Text>

                    <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                    <Text style={styles.paragraph}>
                        By creating an account or using our services, you agree to these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use our services.
                    </Text>

                    <Text style={styles.sectionTitle}>2. Use of Service</Text>
                    <Text style={styles.paragraph}>
                        You must be at least 18 years old to use our services. You agree to use the app only for lawful purposes and properly maintain the security of your account credentials.
                    </Text>

                    <Text style={styles.sectionTitle}>3. Account Registration</Text>
                    <Text style={styles.paragraph}>
                        To place orders, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                    </Text>

                    <Text style={styles.sectionTitle}>4. Product Information and Pricing</Text>
                    <Text style={styles.paragraph}>
                        We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. Prices and availability are subject to change without notice.
                    </Text>

                    <Text style={styles.sectionTitle}>5. Orders and Payments</Text>
                    <Text style={styles.paragraph}>
                        All orders are subject to acceptance. We reserve the right to refuse or cancel any order for any reason. Payment must be made at the time of order placement via the available payment methods.
                    </Text>

                    <Text style={styles.sectionTitle}>6. Delivery</Text>
                    <Text style={styles.paragraph}>
                        We will make every effort to deliver your order within the estimated timeframe. However, delays may occur due to unforeseen circumstances. We are not liable for any delays in delivery.
                    </Text>

                    <Text style={styles.sectionTitle}>7. User Conduct</Text>
                    <Text style={styles.paragraph}>
                        You agree not to modify, reverse engineer, or interfere with the operation of our app. You also agree not to use our services to harass, abuse, or harm another person.
                    </Text>

                    <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
                    <Text style={styles.paragraph}>
                        To the maximum extent permitted by law, Online Dhudhiya shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
                    </Text>

                    <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
                    <Text style={styles.paragraph}>
                        We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the service after such changes constitutes your acceptance of the new Terms.
                    </Text>

                    <Text style={styles.sectionTitle}>10. Contact Information</Text>
                    <Text style={styles.paragraph}>
                        If you have any questions about these Terms, please contact us at onlinedudhiya01@gmail.com.
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

export default TermsAndConditions;
