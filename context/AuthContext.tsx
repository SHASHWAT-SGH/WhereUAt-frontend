import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
  User,
} from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axiosInstance";

GoogleSignin.configure({
  webClientId: Constants.expoConfig?.extra?.GOOGLE_SIGNIN_WEB_CLIENT_ID ?? "", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  iosClientId: Constants.expoConfig?.extra?.GOOGLE_SIGNIN_IOS_CLIENT_ID ?? "", // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signinWithGoogle: () => Promise<void>;
  signoutFromGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // read token from secure storage on mount
  useEffect(() => {
    const fetchStoredUser = async () => {
      setIsLoading(true);
      try {
        const storedUser = await SecureStore.getItemAsync("OAuthTokenResponse");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching stored user:", error);
        setUser(null);
      }
      setIsLoading(false);
    };

    fetchStoredUser();
  }, []);

  const signinWithGoogle = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        // signin to backend
        const res = await api.post("/api/v1/auth/login", {
          firstName: response.data.user.givenName,
          lastName: response.data.user.familyName,
          userEmail: response.data.user.email,
        });
        if (res.status == 200 || res.status == 201) {
          // user already exists or user created successfully
          setUser(response.data);
          console.log("User Info: ", response.data);

          // store into secure storage
          await SecureStore.setItemAsync(
            "OAuthTokenResponse",
            JSON.stringify(response.data)
          );

          // set the token in axios instance
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.idToken}`;
        } else {
          console.error("Error during sign in:", res.data);
        }
      } else {
        // sign in was cancelled by user
        setUser(null);
        // remove from secure storage
        await SecureStore.deleteItemAsync("OAuthTokenResponse");
      }
    } catch (error) {
      console.error("error", error);
      setUser(null);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
    setIsLoading(false);
  };

  const signoutFromGoogle = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.signOut();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const contextData: AuthContextType = {
    user,
    isLoading,
    signinWithGoogle,
    signoutFromGoogle,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
