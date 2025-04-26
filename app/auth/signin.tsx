import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

export default function SigninScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { sendOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Invalid Phone Number", "Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      const success = await sendOtp(phoneNumber);
      if (success) {
        // Animate transition to OTP screen
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowOtpInput(true);
          fadeAnim.setValue(1);
          slideAnim.setValue(0);
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const success = await verifyOtp(phoneNumber, otp);
      if (success) {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Invalid OTP",
          "The OTP you entered is incorrect. Please try again."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    // Animate transition back to phone number screen
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowOtpInput(false);
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.contentContainer}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="location-outline" size={40} color="#6366f1" />
              </View>
              <Text style={styles.appTitle}>WhereUAt</Text>
            </View>

            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateX: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, showOtpInput ? -300 : 300],
                      }),
                    },
                  ],
                },
              ]}
            >
              {!showOtpInput ? (
                <>
                  <Text style={styles.title}>Sign In</Text>
                  <Text style={styles.subtitle}>
                    Please enter your phone number to continue
                  </Text>

                  <View style={styles.inputContainer}>
                    <View style={styles.phoneInputContainer}>
                      <Text style={styles.countryCode}>+1</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        maxLength={10}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      !phoneNumber && styles.buttonDisabled,
                    ]}
                    onPress={handleSendOtp}
                    disabled={isLoading || !phoneNumber}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.buttonText}>Send OTP</Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackToPhone}
                  >
                    <Ionicons name="arrow-back" size={24} color="#6366f1" />
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>

                  <Text style={styles.title}>Verify OTP</Text>
                  <Text style={styles.subtitle}>
                    Enter the 6-digit code sent to {phoneNumber}
                  </Text>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.otpInput}
                      placeholder="6-digit OTP"
                      keyboardType="number-pad"
                      value={otp}
                      onChangeText={setOtp}
                      maxLength={6}
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      otp.length !== 6 && styles.buttonDisabled,
                    ]}
                    onPress={handleVerifyOtp}
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.buttonText}>Verify OTP</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={handleSendOtp}
                  >
                    <Text style={styles.resendButtonText}>Resend OTP</Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7ff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    overflow: "hidden",
  },
  countryCode: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f3f4f6",
    color: "#374151",
    fontWeight: "bold",
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1f2937",
  },
  otpInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1f2937",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    textAlign: "center",
    letterSpacing: 4,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#a5b4fc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButtonText: {
    marginLeft: 4,
    color: "#6366f1",
    fontWeight: "500",
  },
  resendButton: {
    alignItems: "center",
  },
  resendButtonText: {
    color: "#6366f1",
    fontWeight: "500",
  },
});
