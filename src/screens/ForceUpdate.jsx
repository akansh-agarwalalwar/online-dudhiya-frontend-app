import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Linking,
    StatusBar,
    Dimensions,
} from 'react-native';
import ScreenWrapper from '../components/common/ScreenWrapper';
import LinearGradient from 'react-native-linear-gradient';
import COLORS from '../constants/Color';
import { THEME, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/Theme';
import { Smartphone, Download, RefreshCw } from 'lucide-react-native';
import updateService from '../services/UpdateService';

const { width } = Dimensions.get('window');

const ForceUpdate = () => {
    const handleUpdate = async () => {
        await updateService.performUpdate();
    };

    return (
        <ScreenWrapper topSafeArea={false} bottomSafeArea={true}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <View style={styles.container}>
                <LinearGradient
                    colors={[COLORS.PRIMARY_LIGHT, COLORS.WHITE]}
                    style={styles.headerGradient}
                >
                    <View style={styles.imageContainer}>
                        <View style={styles.iconCircle}>
                            <RefreshCw size={60} color={COLORS.PRIMARY} strokeWidth={1.5} />
                        </View>
                        <View style={styles.downloadBadge}>
                            <Download size={20} color={COLORS.WHITE} strokeWidth={3} />
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    <Image
                        source={require('../assets/images/logos/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>Update Required</Text>
                    <Text style={styles.subtitle}>
                        A new version of Online Dudhiya is available. Please update to continue enjoying our services with better performance and new features.
                    </Text>

                    <View style={styles.featuresContainer}>
                        <View style={styles.featureRow}>
                            <View style={[styles.dot, { backgroundColor: COLORS.ACCENT_GREEN }]} />
                            <Text style={styles.featureText}>Better Performance & Stability</Text>
                        </View>
                        <View style={styles.featureRow}>
                            <View style={[styles.dot, { backgroundColor: COLORS.ACCENT_ORANGE }]} />
                            <Text style={styles.featureText}>New Exclusive Features</Text>
                        </View>
                        <View style={styles.featureRow}>
                            <View style={[styles.dot, { backgroundColor: COLORS.PRIMARY }]} />
                            <Text style={styles.featureText}>Security Improvements</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.8}
                        onPress={handleUpdate}
                    >
                        <LinearGradient
                            colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
                            style={styles.gradientButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.buttonText}>UPDATE NOW</Text>
                            <Download size={20} color={COLORS.WHITE} style={{ marginLeft: 8 }} />
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.versionText}>Version 1.0.4 is no longer supported</Text>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    headerGradient: {
        height: width * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    imageContainer: {
        padding: 20,
        position: 'relative',
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    downloadBadge: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        backgroundColor: COLORS.ACCENT_ORANGE,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: COLORS.WHITE,
        elevation: 4,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        alignItems: 'center',
        paddingTop: 40,
    },
    logo: {
        width: 100,
        height: 40,
        marginBottom: 20,
    },
    title: {
        ...TYPOGRAPHY.h2,
        color: COLORS.DARK,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        color: COLORS.GRAY,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    featuresContainer: {
        width: '100%',
        backgroundColor: COLORS.LIGHT_GRAY,
        padding: 20,
        borderRadius: BORDER_RADIUS.lg,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    featureText: {
        ...TYPOGRAPHY.bodySmall,
        color: COLORS.DARK,
        fontWeight: '500',
    },
    footer: {
        padding: 30,
        alignItems: 'center',
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        marginBottom: 15,
        elevation: 5,
        shadowColor: COLORS.PRIMARY,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    gradientButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    },
    versionText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.GRAY,
    },
});

export default ForceUpdate;
