import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import ScreenWrapper from '../components/common/ScreenWrapper';
import AppHeader from '../components/common/AppHeader';
import COLORS from '../constants/Color';
import { useNavigation } from '@react-navigation/native';
import { ChevronDown, ChevronUp, Phone, Mail, MessageCircle, HelpCircle } from 'lucide-react-native';

const FAQItem = ({ question, answer }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <View style={styles.faqItem}>
            <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => setExpanded(!expanded)}
                activeOpacity={0.7}
            >
                <Text style={[styles.faqQuestion, expanded && { color: COLORS.PRIMARY }]}>{question}</Text>
                {expanded ? <ChevronUp size={20} color={COLORS.PRIMARY} /> : <ChevronDown size={20} color={COLORS.GRAY} />}
            </TouchableOpacity>
            {expanded && (
                <View style={styles.faqBody}>
                    <Text style={styles.faqAnswer}>{answer}</Text>
                </View>
            )}
        </View>
    );
};

const HelpAndSupport = () => {
    const navigation = useNavigation();

    const handleEmail = () => {
        Linking.openURL('mailto:support@onlinedhudhiya.com');
    };

    const handleCall = () => {
        Linking.openURL('tel:+919876543210');
    };

    const handleChat = () => {
        Linking.openURL('https://wa.me/919876543210');
    };

    return (
        <ScreenWrapper topSafeArea={false} backgroundColor={COLORS.BACKGROUND}>
            <AppHeader
                title="Help & Support"
                showBack={true}
                onBackPress={() => navigation.goBack()}
            />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                <View style={styles.headerSection}>
                    <Text style={styles.welcomeText}>How can we help you?</Text>
                    <Text style={styles.subText}>Select an option below or browse our FAQs</Text>
                </View>

                <View style={styles.contactContainer}>
                    <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                            <Phone size={24} color="#1E88E5" />
                        </View>
                        <Text style={styles.contactLabel}>Call Us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                        <View style={[styles.iconBox, { backgroundColor: '#FCE4EC' }]}>
                            <Mail size={24} color="#D81B60" />
                        </View>
                        <Text style={styles.contactLabel}>Email Us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem} onPress={handleChat}>
                        <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                            <MessageCircle size={24} color="#43A047" />
                        </View>
                        <Text style={styles.contactLabel}>Chat</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.faqSection}>
                    <View style={styles.sectionHeaderContainer}>
                        <HelpCircle size={20} color={COLORS.PRIMARY} />
                        <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
                    </View>

                    <FAQItem
                        question="How do I place an order?"
                        answer="You can place an order by browsing our products, adding your desired items to the cart, and proceeding to checkout. We offer seamless delivery options."
                    />
                    <FAQItem
                        question="What payment methods do you accept?"
                        answer="We accept various payment methods including Credit/Debit cards, UPI (Google Pay, PhonePe, Paytm), and Cash on Delivery (COD) for your convenience."
                    />
                    <FAQItem
                        question="How can I track my delivery?"
                        answer="Once your order is confirmed, you can track its status in the 'My Orders' section of your profile. We'll also send you updates via SMS/Email."
                    />
                    <FAQItem
                        question="What if I receive a damaged product?"
                        answer="We have a strict quality control process, but if you receive a damaged product, please contact our support team immediately within 24 hours. We will replace it or initiate a refund."
                    />
                    <FAQItem
                        question="Can I change my delivery address?"
                        answer="Yes, you can manage and add new delivery addresses in the 'My Addresses' section under your Profile settings."
                    />
                    <FAQItem
                        question="How do I contact customer support?"
                        answer="You can contact us via the 'Call Us', 'Email Us', or 'Chat' buttons available at the top of this Help & Support page."
                    />
                </View>

                <View style={styles.footerSpacing} />
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerSection: {
        padding: 20,
        backgroundColor: COLORS.WHITE,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.DARK,
        marginBottom: 8,
    },
    subText: {
        fontSize: 14,
        color: COLORS.GRAY,
    },
    contactContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: COLORS.WHITE,
        marginBottom: 16,
        paddingBottom: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    contactItem: {
        alignItems: 'center',
        flex: 1,
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    contactLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.DARK,
    },
    faqSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.DARK,
        marginLeft: 8,
    },
    faqItem: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        marginBottom: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.DARK,
        flex: 1,
        marginRight: 10,
        lineHeight: 22,
    },
    faqBody: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        paddingTop: 12,
    },
    faqAnswer: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
    },
    footerSpacing: {
        height: 40,
    },
});

export default HelpAndSupport;
