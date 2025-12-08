import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LinearGradient from 'react-native-linear-gradient';
import { Check } from 'lucide-react-native';
import COLORS from '../constants/Color';

export default function Login({ navigation }) {
  const [mobile, setMobile] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    const digits = mobile.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    // if (!acceptedTerms) {
    //   setError("Please accept the Terms & Conditions to continue.");
    //   return;
    // }
    setError("");
    navigation.navigate("OtpVerification", { phone: digits });
  };

  return (
    <LinearGradient colors={[COLORS.WHITE, COLORS.LIGHT_GRAY]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
              <Image
                source={require("../assets/images/logos/logowbg.png")}
                style={{ width: 120, height: 120, alignSelf: "center", marginBottom: 0, borderRadius: 80 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 20, color: COLORS.DARK }}>Online <Text style={{ color: COLORS.PRIMARY }}>Dudhiya</Text> </Text>
              <View style={styles.card}>
                <Text style={styles.title}>Lets Get Started</Text>
                <Text style={{ marginBottom: 28, color: COLORS.GRAY, textAlign: "center" }}>Enter your mobile number to proceed further</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="Enter Mobile Number"
                  placeholderTextColor={COLORS.GRAY}
                  value={mobile}
                  onChangeText={(t) => setMobile(t.replace(/\D/g, "").slice(0, 10))}
                  accessibilityLabel="Mobile number"
                />

                {/* <Pressable
                  style={styles.termsRow}
                  onPress={() => setAcceptedTerms((v) => !v)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: acceptedTerms }}
                >
                  <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                    {acceptedTerms ? <Check size={18} color="#fff" /> : null}
                  </View>
                   */}
                {/* </Pressable> */}

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity
                  style={[
                    styles.button,
                    (mobile.replace(/\D/g, "").length !== 10) && styles.buttonDisabled,
                  ]}
                  onPress={handleLogin}
                  disabled={mobile.replace(/\D/g, "").length !== 10}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Send OTP</Text>
                </TouchableOpacity>

                <Text style={{ marginTop: 24, textAlign: "center", color: COLORS.PRIMARY, fontSize: 16, fontWeight: '500' }}>
                  Continue As Guest
                </Text>

                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>
                <TouchableOpacity
                  style={styles.googleButton}
                // onPress={handleGoogleLogin}
                // disabled={isLoading}
                >
                  <Image
                    source={require('../assets/images/logos/google.png')}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, marginTop: StatusBar.currentHeight, padding: 20 },
  card: {
    // backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 4 },
    // shadowRadius: 12,
    // elevation: 6,
  },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 4, textAlign: "center", color: COLORS.DARK },
  input: {
    borderBottomWidth: 1,
    borderColor: COLORS.GRAY,
    backgroundColor: COLORS.WHITE,
    padding: 14,
    borderRadius: 2,
    fontSize: 16,
    color: COLORS.DARK,
    marginBottom: 28,
  },
  termsRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.LIGHT_GRAY,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  termsText: { flex: 1, color: COLORS.DARK },
  link: { color: COLORS.ACCENT_ORANGE, fontWeight: "600" },
  error: { color: COLORS.ERROR, marginBottom: 12 },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: COLORS.GRAY,
  },
  buttonText: { color: COLORS.WHITE, fontSize: 16, fontWeight: "700" },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.GRAY,
  },
  dividerText: {
    fontSize: 14,
    color: COLORS.DARK,
    marginHorizontal: 16,
    // fontFamily: FO,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 0.5,
    borderColor: COLORS.PRIMARY_DARK,
    borderRadius: 12,
    backgroundColor: '#f4f4f4ff', // Google Blue
    marginTop: 16,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  googleButtonText: {
    fontSize: 16,
    color: COLORS.BLACK,
  },
});
