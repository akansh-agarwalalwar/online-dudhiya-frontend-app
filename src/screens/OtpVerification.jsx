import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
} from "react-native";
import OTPInput from "../components/auth/OtpInput";
import COLORS from "../constants/Color";
import { Edit, Icon, Pen, ChevronLeft, Loader } from "lucide-react-native";
import { ScreenWrapper } from "../components/common/ScreenWrapper";
import { useAuthActions, useAuthState } from "../contexts/AuthContext";
import { setRedirectScreen } from "../redux/slices/authSlice";

const OtpVerificationScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { phone, message } = route.params || {};
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [localError, setLocalError] = useState("");

  // Auth context
  const { verifyOTP, requestOTP } = useAuthActions();
  const { isLoading, error } = useAuthState();

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);


  const handleVerify = async () => {
    Keyboard.dismiss();

    // Validate OTP length (expecting 6-digit OTP from backend)
    if (otp.length !== 6) {
      setLocalError("Please enter a valid 6-digit OTP.");
      return;
    }

    // Clear previous errors
    setLocalError("");

    try {
      // Verify OTP through auth service
      const result = await verifyOTP(phone, otp);

      if (result.success) {
        // Debug: Log the entire user object
        console.log('🔍 OTP Verification - Full result:', JSON.stringify(result, null, 2));
        console.log('🔍 OTP Verification - User object:', result.user);
        console.log('🔍 OTP Verification - User name:', result.user?.name);
        console.log('🔍 OTP Verification - User name type:', typeof result.user?.name);

        // Check if user has a name
        const hasName = result.user?.name && result.user.name.trim() !== '';
        console.log('🔍 OTP Verification - hasName:', hasName);

        // Update Redux state for compatibility
        dispatch({
          type: "auth/loginSuccess",
          payload: {
            token: result.token,
            user: result.user,
          },
        });

        // Set redirect screen based on user profile completeness
        if (!hasName) {
          // User doesn't have a name, set redirect to EditProfile
          console.log('📍 Redirecting to EditProfile (no name)');
          dispatch(setRedirectScreen('EditProfile'));
        } else {
          // User has a name, set redirect to Home (or null to go to default)
          console.log('📍 Redirecting to Home (has name)');
          dispatch(setRedirectScreen('MainTabs'));
        }

        // Show success message
        Alert.alert(
          "Success",
          "OTP Verified Successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                // Navigation will be handled automatically by MainTabs
                // based on the redirectScreen value we set above
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('OTP verification error:', error);

      // Show error alert
      Alert.alert(
        "Verification Failed",
        error.message || "OTP verification failed. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleResend = async () => {
    if (!canResend || isLoading) return;

    try {
      // Clear previous errors and OTP
      setLocalError("");
      setOtp("");

      // Request new OTP
      const result = await requestOTP(phone, 'LOGIN');

      if (result.success) {
        // Reset timer
        setTimer(60);
        setCanResend(false);

        // Show success message
        Alert.alert(
          "OTP Sent",
          result.message || `New OTP sent to ${phone}`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('OTP resend error:', error);

      Alert.alert(
        "Error",
        error.message || "Failed to resend OTP. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <ScreenWrapper bottomSafeArea={false} topSafeArea={false} style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
        <ChevronLeft size={28} color={COLORS.PRIMARY} />
      </TouchableOpacity>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit OTP sent to your mobile number <Text style={styles.phone}>{phone}</Text>
        <Pen size={16} color={COLORS.PRIMARY} onPress={() => navigation.goBack()} />
      </Text>

      <OTPInput code={otp} setCode={setOtp} maximumLength={6} />

      {(localError || error) ? (
        <Text style={styles.error}>
          {localError || error}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[styles.button, (isLoading || otp.length !== 6) && { opacity: 0.6 }]}
        disabled={isLoading || otp.length !== 6}
        onPress={handleVerify}
      >
        <View style={styles.buttonContent}>
          {isLoading && (
            <Loader
              size={20}
              color={COLORS.WHITE}
              style={styles.loadingIcon}
            />
          )}
          <Text style={styles.buttonText}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResend}
        disabled={!canResend || isLoading}
        style={styles.resendContainer}
      >
        <View style={styles.resendContent}>
          {isLoading && canResend && (
            <Loader
              size={16}
              color={COLORS.PRIMARY}
              style={styles.resendLoadingIcon}
            />
          )}
          <Text style={[
            styles.resend,
            {
              color: (canResend && !isLoading) ? COLORS.PRIMARY : COLORS.GRAY,
              opacity: (canResend && !isLoading) ? 1 : 0.6
            }
          ]}>
            {!canResend
              ? `Resend OTP in 0:${timer < 10 ? `0${timer}` : timer}`
              : isLoading
                ? 'Sending OTP...'
                : 'Resend OTP'
            }
          </Text>
        </View>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  backIcon: {
    position: 'absolute',
    top: 24,
    left: 16,
    zIndex: 10,
    backgroundColor: 'transparent',
    padding: 4,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    // textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 24,
    // textAlign: "center",
  },
  phone: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
    color: COLORS.PRIMARY
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  resend: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
    color: "#2F5795",
    fontWeight: "600",
  },
  resendContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  resendContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendLoadingIcon: {
    marginRight: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: {
    marginRight: 8,
  },
  error: {
    color: COLORS.ERROR,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});
