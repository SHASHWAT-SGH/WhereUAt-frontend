import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function SettingsScreen() {
  const { signout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleSignout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signout();
          } catch (error) {
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionHeader}>Preferences</Text>

        <View style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#6366f1"
              />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Enable push notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#d1d5db", true: "#c7d2fe" }}
              thumbColor={notificationsEnabled ? "#6366f1" : "#9ca3af"}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="moon-outline" size={22} color="#6366f1" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Switch app appearance
              </Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: "#d1d5db", true: "#c7d2fe" }}
              thumbColor={darkModeEnabled ? "#6366f1" : "#9ca3af"}
            />
          </View>
        </View>

        <Text style={styles.sectionHeader}>Account</Text>

        <View style={styles.section}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#6366f1"
              />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Privacy</Text>
              <Text style={styles.settingDescription}>Manage your data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="help-circle-outline" size={22} color="#6366f1" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Help Center</Text>
              <Text style={styles.settingDescription}>Get support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.signoutButtonContainer}>
          <TouchableOpacity
            style={styles.signoutButton}
            onPress={handleSignout}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#ef4444"
              style={styles.signoutIcon}
            />
            <Text style={styles.signoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7ff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6b7280",
    marginBottom: 12,
    marginLeft: 8,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginLeft: 68,
  },
  signoutButtonContainer: {
    marginTop: "auto",
    marginBottom: 24,
  },
  signoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    padding: 14,
  },
  signoutIcon: {
    marginRight: 8,
  },
  signoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ef4444",
  },
});
