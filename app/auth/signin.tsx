import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function SigninScreen() {
  const { signinWithGoogle, isLoading } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#4f46e5", "#3730a3"]}
        style={styles.backgroundGradient}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="location" size={40} color="#FFA000" />
            </View>
            <Text style={styles.appTitle}>WhereUAt</Text>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.welcomeSection}>
              <Text style={styles.title}>Welcome</Text>
              <Text style={styles.subtitle}>
                Sign in to continue to the app
              </Text>
            </View>

            <View style={styles.googleButtonContainer}>
              <TouchableOpacity
                style={styles.googleButton}
                onPress={signinWithGoogle}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#4285F4" />
                ) : (
                  <>
                    <View style={styles.googleIconContainer}>
                      <Image
                        source={require("../../assets/images/google-icon.png")}
                        resizeMode="contain"
                        style={styles.googleIcon}
                      />
                    </View>
                    <Text style={styles.googleButtonText}>
                      Sign in with Google
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.policyContainer}>
              <Text style={styles.policyText}>
                By signing in, you agree to our{" "}
                <Text style={styles.policyLink}>Terms of Service</Text> and{" "}
                <Text style={styles.policyLink}>Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height + 50,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardContainer: {
    width: width - 48,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  googleButtonContainer: {
    marginBottom: 24,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  googleIconContainer: {
    marginRight: 12,
  },
  googleIcon: {
    width: 28,
    height: 28,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a5568",
  },
  policyContainer: {
    marginTop: 12,
  },
  policyText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 18,
  },
  policyLink: {
    color: "#4f46e5",
    fontWeight: "500",
  },
});
