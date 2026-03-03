import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

/* expo picker doesnt work yet, could possibly change other dependencies (dont wanna break anything) */

function Row({
  icon,
  label,
  danger = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color="#111" />
        <Text style={[styles.rowText, danger && { fontWeight: "600" }]}>
          {label}
        </Text>
      </View>
      {!danger && (
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const [photo, setPhoto] = useState<string | null>(null);

  const pickImage = async () => {
    Alert.alert(
      "profile picture disabled",
      "This is temporarily disabled to avoid changing project dependencies. We can enable it later."
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Profile Section */}
      <View style={styles.profileCard}>
        <Pressable style={styles.avatar} onPress={pickImage}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={32} color="#111" />
          )}
        </Pressable>

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.name}>First Name Last Name</Text>
          <Text style={styles.phone}>(XXX) XXX - XXXX</Text>

          <Pressable style={styles.editButton}>
            <Text style={styles.editText}>Edit Profile</Text>
          </Pressable>
        </View>
      </View>

      {/* Options */}
      <View style={styles.card}>
        <Row icon="notifications-outline" label="Notifications" />
        <View style={styles.divider} />
        <Row icon="home-outline" label="Places" />
        <View style={styles.divider} />
        <Row icon="shield-checkmark-outline" label="Login & Security" />
      </View>

      <View style={{ height: 12 }} />

      <View style={styles.card}>
        <Row icon="log-out-outline" label="Log Out" danger />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 12,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FDEBD0",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
  },

  phone: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  editButton: {
    marginTop: 8,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignSelf: "flex-start",
  },

  editText: {
    fontSize: 13,
    fontWeight: "600",
  },

  card: {
    marginTop: 14,
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  rowText: {
    fontSize: 14,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 44,
  },
});