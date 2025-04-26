import React, { createContext, useState, useContext, useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

interface User {
  phoneNumber: string;
  userId: string;
}

interface AuthContextType {
  session: string | null;
  user: User | null;
  loading: boolean;
  signin: (userData: User) => Promise<void>;
  signout: () => Promise<void>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<boolean>;
  sendOtp: (phoneNumber: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkLoginState = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync("user");
        const storedSession = await SecureStore.getItemAsync("session");

        if (storedUser && storedSession) {
          setUser(JSON.parse(storedUser));
          setSession(storedSession);
        }
      } catch (error) {
        console.error("Error retrieving auth state:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginState();
  }, []);

  // Mock OTP sending function (replace with actual implementation)
  const sendOtp = async (phoneNumber: string): Promise<boolean> => {
    // In a real app, you would call your backend to send an OTP
    console.log(`Sending OTP to ${phoneNumber}`);
    // Simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  };

  // Mock OTP verification function (replace with actual implementation)
  const verifyOtp = async (
    phoneNumber: string,
    otp: string
  ): Promise<boolean> => {
    // In a real app, you would verify the OTP with your backend
    console.log(`Verifying OTP ${otp} for ${phoneNumber}`);
    // Simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo purposes, any OTP works
    if (otp.length === 6) {
      const mockUser = {
        phoneNumber,
        userId: `user_${Date.now()}`,
      };
      await signin(mockUser);
      return true;
    }
    return false;
  };

  const signin = async (userData: User) => {
    try {
      const newSession = `session_${Date.now()}`;
      await SecureStore.setItemAsync("user", JSON.stringify(userData));
      await SecureStore.setItemAsync("session", newSession);

      setUser(userData);
      setSession(newSession);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signout = async () => {
    try {
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("session");

      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const contextData: AuthContextType = {
    session,
    user,
    loading,
    signin,
    signout,
    verifyOtp,
    sendOtp,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? (
        <SafeAreaView className="flex-1 justify-center items-center">
          <Text className="text-lg">Loading...</Text>
        </SafeAreaView>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth, AuthContext };
