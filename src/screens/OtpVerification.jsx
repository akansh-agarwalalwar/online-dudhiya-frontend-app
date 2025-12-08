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
import { Edit, Icon, Pen, ChevronLeft } from "lucide-react-native";
import { ScreenWrapper } from "../components/common/ScreenWrapper";

const OtpVerificationScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { phone } = route.params || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
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

    if (otp.length !== 4) {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      // API Call Example
      // const res = await axios.post("https://api.example.com/verify-otp", {
      //   phone,
      //   otp,
      // });

      setTimeout(() => {
        setLoading(false);
        Alert.alert("Success", "OTP Verified Successfully!");
        // Set dummy token in Redux and navigate to MainTabs
        dispatch({
          type: "auth/loginSuccess",
          payload: {
            token: "dummytoken",
            user: { phone },
          },
        });
        // navigation.replace("MainTabs");
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "OTP verification failed!");
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    Alert.alert("OTP Sent", `New OTP sent to ${phone}`);
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

      <OTPInput code={otp} setCode={setOtp} maximumLength={4} />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        disabled={loading}
        onPress={handleVerify}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResend} disabled={!canResend}>
        <Text style={[styles.resend, { color: canResend ? '#2F5795' : '#aaa' }]}>Resend OTP{!canResend ? ` in 0:${timer < 10 ? `0${timer}` : timer}` : ''}</Text>
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
    color:COLORS.PRIMARY
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
});
