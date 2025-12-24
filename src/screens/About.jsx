import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import ScreenWrapper from '../components/common/ScreenWrapper';
import AppHeader from '../components/common/AppHeader';
import COLORS from '../constants/Color';
import { useNavigation } from '@react-navigation/native';
import { Mail, Globe, ShieldCheck, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const About = () => {
    const navigation = useNavigation();

    return (
        <ScreenWrapper topSafeArea={false} backgroundColor={COLORS.BACKGROUND}>
            <AppHeader
                title="About Us"
                showBack={true}
                onBackPress={() => navigation.goBack()}
            />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>OD</Text>
                    </View>
                    <Text style={styles.appName}>Online Dhudhiya</Text>
                    <Text style={styles.version}>Version 1.0.0</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Who We Are</Text>
                    <Text style={styles.description}>
                        Online Dhudhiya is your trusted partner for fresh dairy products delivered straight to your doorstep.
                        We are committed to providing high-quality, unadulterated milk and dairy products to ensure the health and well-being of your family.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Our Mission</Text>
                    <Text style={styles.description}>
                        To revolutionize the dairy supply chain by connecting local farmers directly with consumers, ensuring fair prices for producers and fresh, pure products for our customers.
                    </Text>
                </View>

                <View style={styles.featuresContainer}>
                    <View style={styles.featureItem}>
                        <ShieldCheck size={28} color={COLORS.PRIMARY} />
                        <Text style={styles.featureText}>100% Pure</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Heart size={28} color={COLORS.ERROR} />
                        <Text style={styles.featureText}>Made with Love</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Globe size={28} color={COLORS.ACCENT_GREEN} />
                        <Text style={styles.featureText}>Local Sourcing</Text>
                    </View>
                </View>

                <View style={[styles.card, styles.contactInfo]}>
                    <Text style={styles.sectionTitle}>Get in Touch</Text>
                    <View style={styles.infoRow}>
                        <Globe size={20} color={COLORS.GRAY} />
                        <Text style={styles.infoText}>www.onlinedhudhiya.com</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Mail size={20} color={COLORS.GRAY} />
                        <Text style={styles.infoText}>contact@onlinedhudhiya.com</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2024 Online Dhudhiya. All rights reserved.</Text>
                    <Text style={styles.footerText}>Made with ❤️ in India</Text>
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
    logoContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: COLORS.BACKGROUND,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: COLORS.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 5,
        shadowColor: COLORS.PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.WHITE,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.DARK,
        marginBottom: 4,
    },
    version: {
        fontSize: 14,
        color: COLORS.GRAY,
    },
    card: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.DARK,
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: '#555',
    },
    featuresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        marginBottom: 20,
    },
    featureItem: {
        alignItems: 'center',
    },
    featureText: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.DARK,
    },
    contactInfo: {
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    infoText: {
        fontSize: 15,
        color: '#555',
        marginLeft: 12,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    footerText: {
        fontSize: 12,
        color: COLORS.GRAY,
        marginBottom: 4,
    },
});

export default About;
