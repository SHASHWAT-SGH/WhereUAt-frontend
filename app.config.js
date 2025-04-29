import "dotenv/config";

export default ({ config }) => {
  return {
    ...config,
    name: "WhereUAt",
    slug: "WhereUAt",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.shashwat_singh_8080.WhereUAt",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-secure-store",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: "com.googleusercontent.apps.1234567890-abcdefg",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "6a944df2-032a-47c1-bb70-f270b7418841",
      },
      GOOGLE_SIGNIN_WEB_CLIENT_ID: process.env.GOOGLE_SIGNIN_WEB_CLIENT_ID,
      GOOGLE_SIGNIN_IOS_CLIENT_ID: process.env.GOOGLE_SIGNIN_IOS_CLIENT_ID,
      GOOGLE_SIGNIN_IOS_URL_SCHEME: process.env.GOOGLE_SIGNIN_IOS_URL_SCHEME,
      GOOGLE_SIGNIN_ANDROID_CLIENT_ID:
        process.env.GOOGLE_SIGNIN_ANDROID_CLIENT_ID,
    },
  };
};
