import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/common/ScreenWrapper';
import AppHeader from '../components/common/AppHeader';
import COLORS from '../constants/Color';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicy = () => {
    const navigation = useNavigation();

    return (
        <ScreenWrapper topSafeArea={false} backgroundColor={COLORS.BACKGROUND}>
            <AppHeader
                title="Privacy Policy"
                showBack={true}
                onBackPress={() => navigation.goBack()}
            />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    <Text style={styles.paragraph}>
                        Our grocery ordering app collects and uses personal information to provide and improve our services. We collect data when you register, place an order, or use the app’s features. We will not share or sell your personal data except as described below. This Privacy Policy explains what information we collect, how we use it, and your choices.
                    </Text>

                    <Text style={styles.sectionTitle}>Information We Collect</Text>
                    <Text style={styles.paragraph}>
                        We collect personal information needed to fulfill your orders and personalize our service. This includes account and contact details (such as your name, email, phone number, and postal address) and order details (items ordered, delivery/shipping address, and payment information). We also gather usage and technical data – for example, your IP address, device or browser type, and app interactions – to help improve the app and diagnose issues. Demographic information (such as age or gender) is collected only if you choose to provide it. In summary, we may collect:
                    </Text>

                    <Text style={styles.subTitle}>Account and Contact Data:</Text>
                    <Text style={styles.paragraph}>Name, email address, phone number, and home address.</Text>

                    <Text style={styles.subTitle}>Order Details:</Text>
                    <Text style={styles.paragraph}>Products purchased, billing/shipping addresses, and payment details (collected securely via our payment gateway).</Text>

                    <Text style={styles.subTitle}>Usage Data:</Text>
                    <Text style={styles.paragraph}>Log data like IP address, device ID, browser type, and the app pages or features you access.</Text>

                    <Text style={styles.subTitle}>Location Data:</Text>
                    <Text style={styles.paragraph}>With your permission, your device’s location to enable delivery and location-based features.</Text>

                    <Text style={styles.subTitle}>Cookies & Tracking:</Text>
                    <Text style={styles.paragraph}>Information stored by cookies or similar technologies (see “Cookies and Tracking Technologies” below).</Text>

                    <Text style={styles.paragraph}>
                        We collect this information through your account registration, order forms, cookies/analytics, and when you use the app. For example, when you place an order we record the items, your delivery address, and payment method to process the transaction.
                    </Text>

                    <Text style={styles.sectionTitle}>How We Use Your Information</Text>
                    <Text style={styles.paragraph}>
                        We use the collected information to operate and improve our service, including:
                    </Text>
                    <Text style={styles.subTitle}>Order Fulfillment:</Text>
                    <Text style={styles.paragraph}>Using your contact, address, and payment details to process and deliver orders.</Text>

                    <Text style={styles.subTitle}>Communication:</Text>
                    <Text style={styles.paragraph}>Sending you order confirmations, shipping updates, and responding to your questions or support requests.</Text>

                    <Text style={styles.subTitle}>Marketing (Optional):</Text>
                    <Text style={styles.paragraph}>With your consent, we send promotional emails or SMS about offers and new products. You can opt-out of these communications at any time.</Text>

                    <Text style={styles.subTitle}>Service Improvement:</Text>
                    <Text style={styles.paragraph}>Analyzing usage data to optimize app performance, develop new features, and detect or prevent fraud.</Text>

                    <Text style={styles.paragraph}>
                        We do not use your personal data for anything other than providing these services or as required by law. For example, we do not sell or rent your personal information to marketers or other third parties. We use aggregated or anonymized data (which cannot identify you) internally for statistical purposes and to improve the app.
                    </Text>

                    <Text style={styles.sectionTitle}>Third-Party Services</Text>
                    <Text style={styles.paragraph}>
                        We may use third-party services to support our app’s functionality. These services operate under their own privacy policies, and we only provide them the data necessary for their function. For example:
                    </Text>
                    <Text style={styles.subTitle}>Payment Gateways:</Text>
                    <Text style={styles.paragraph}>We use external payment processors (such as Stripe, Paytm, or similar) to handle transactions. These processors receive only the necessary payment and order information and are contractually obligated to keep it secure.</Text>

                    <Text style={styles.subTitle}>Analytics & Advertising:</Text>
                    <Text style={styles.paragraph}>We use analytics tools like Google Analytics to track how users interact with our app and (if enabled) to serve relevant ads. These tools may use cookies or similar tracking to collect anonymized usage data.</Text>

                    <Text style={styles.subTitle}>Email/SMS Providers:</Text>
                    <Text style={styles.paragraph}>To send order confirmations or marketing (with your consent), we use third-party email/SMS services (e.g. Mailchimp, Twilio). These providers only get the information needed to send messages and must protect your data.</Text>

                    <Text style={styles.subTitle}>Other Integrations:</Text>
                    <Text style={styles.paragraph}>If we integrate other services (such as maps for delivery or chatbots), those services may collect data as described in their policies.</Text>

                    <Text style={styles.paragraph}>
                        We do not share your personal data with advertisers or other unrelated third parties except in the limited cases above.
                    </Text>

                    <Text style={styles.sectionTitle}>User Accounts and Profiles</Text>
                    <Text style={styles.paragraph}>
                        To use our ordering service, you create a user account. During registration we collect a username (usually your email) and password to secure your account. You can (and should) provide a valid email and phone number so we can contact you about orders. Your account profile may also store saved addresses or payment preferences for convenience. You can log into the app to view or modify your profile, addresses, and password. If you ever forget your login details, you can reset your password via email. You may update or request deletion of your account information at any time by contacting support.
                    </Text>

                    <Text style={styles.sectionTitle}>Location Data</Text>
                    <Text style={styles.paragraph}>
                        If you permit it, our app collects your device’s location to enable delivery and location-based features. We use this location data in the background to find the nearest stores or delivery routes and improve service quality. We do not share your precise location with any outside parties. You can disable location services for our app at any time in your device settings if you do not want us to collect this data.
                    </Text>

                    <Text style={styles.sectionTitle}>Cookies and Tracking Technologies</Text>
                    <Text style={styles.paragraph}>
                        We use cookies and similar tracking technologies (e.g. web beacons, pixels, device identifiers) to personalize and improve your experience. Cookies are small data files placed on your device that help us recognize you and remember preferences. For example, we use cookies to keep you logged in and to track how you navigate the app. Analytics services like Google Analytics also use cookies to collect anonymous usage statistics.
                    </Text>
                    <Text style={styles.paragraph}>
                        You can manage or disable cookies through your browser or device settings. However, if you disable cookies or tracking, some app features (like keeping you logged in or saving preferences) may not work properly.
                    </Text>

                    <Text style={styles.sectionTitle}>Data Sharing and Disclosure</Text>
                    <Text style={styles.paragraph}>
                        We do not sell or rent your personal information to anyone. We share your data only with trusted service providers and partners who need it to perform services on our behalf. For example, we may share your delivery address with a courier company so they can deliver your order. In each case, these third-party providers are bound by strict confidentiality obligations and can only use your data as needed to perform their tasks.
                    </Text>
                    <Text style={styles.paragraph}>
                        We may also disclose your information if required by law or to protect our rights. For instance, we may share data with law enforcement or regulators in response to subpoenas, court orders, or fraud investigations. Any such sharing is done in accordance with legal requirements.
                    </Text>

                    <Text style={styles.sectionTitle}>Data Security</Text>
                    <Text style={styles.paragraph}>
                        We take reasonable measures to protect your information. This includes physical, technical, and administrative safeguards such as encrypted databases and restricted access. Only authorized personnel who require it for their duties can access personal data. While we strive to protect your data, please be aware that no system is completely secure. We cannot guarantee that our security measures are impenetrable, but we will notify you if any breach affects your personal data.
                    </Text>

                    <Text style={styles.sectionTitle}>Your Rights and Choices</Text>
                    <Text style={styles.paragraph}>
                        You have choices about how we use your personal data. You may review, correct, or delete your account information by logging into your profile or contacting us. You can also opt out of marketing emails/SMS at any time using the unsubscribe link in our messages.
                    </Text>
                    <Text style={styles.paragraph}>
                        Depending on where you live, you may have additional rights under local laws. For example, if you are a resident of the European Union, you have rights under the GDPR to access the personal data we hold about you and to request its deletion. Similarly, residents of California have rights to request disclosure or deletion of their data under the CCPA. In all cases, you can request a copy of your data or ask us to delete your data (subject to legal obligations). To exercise these rights, please contact us (see below).
                    </Text>

                    <Text style={styles.sectionTitle}>Legal Compliance and Regions</Text>
                    <Text style={styles.paragraph}>
                        Our app is primarily available in [your country or region], and we comply with applicable local privacy laws. In India, for example, we adhere to the Information Technology Act (2000) and rules thereunder, which require that personal data be processed lawfully and only for the purposes collected. We also intend to comply with global standards: for instance, we respect GDPR requirements for EU users and CCPA requirements for California users, as applicable.
                    </Text>

                    <Text style={styles.sectionTitle}>Changes to This Policy</Text>
                    <Text style={styles.paragraph}>
                        We may update this Privacy Policy from time to time. When we do, we will revise the “Last Updated” date and post the new policy here. Significant changes will be communicated to you (for example, by email or in-app notice). We encourage you to review this policy periodically. Continued use of the app after a change means you accept the updated policy.
                    </Text>

                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <Text style={styles.paragraph}>
                        If you have any questions or concerns about this Privacy Policy or our data practices, please contact our support team at support@example.com. If you are in India or seek a formal grievance redressal, we have appointed a Grievance Officer: [Name], email grievance@example.com. We will respond to any privacy-related complaint within a reasonable time.
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
    subTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.DARK,
        marginTop: 10,
        marginBottom: 5,
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

export default PrivacyPolicy;
