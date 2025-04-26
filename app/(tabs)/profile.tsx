import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={60} color="#6366f1" />
          </View>
          <Text style={styles.phoneText}>{user?.phoneNumber}</Text>
          <Text style={styles.userIdText}>User ID: {user?.userId}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Account Type</Text>
            <Text style={styles.infoValue}>Standard</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Joined Date</Text>
            <Text style={styles.infoValue}>April 2025</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  phoneText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  userIdText: {
    fontSize: 14,
    color: "#6b7280",
  },
  infoSection: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  infoLabel: {
    fontSize: 14,
    color: "#4b5563",
  },
  infoValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "500",
  },
});
