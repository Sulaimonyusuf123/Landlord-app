// Navbar.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { logoutUser } from "../../lib/appwrite"; // Adjust path to your Appwrite config

const Navbar = ({ closeNav }) => {
  const router = useRouter();

  const handleCloseButton = () => {
    console.log("Close button pressed");
    closeNav();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/(auth)/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Failed to logout:", error);
      // Optionally add user feedback here (e.g., an alert)
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.closeButton}
        activeOpacity={0.5}
        onPress={handleCloseButton}
      >
        <Ionicons name="close" size={30} color="black" />
      </TouchableOpacity>

      <Text style={styles.logo}>MALIK</Text>

      <TouchableOpacity onPress={() => router.replace("/(tabs)/dashboard")} style={styles.navItem}>
        <Ionicons name="grid" size={20} color="teal" />
        <Text style={styles.navText}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(tabs)/tenant")} style={styles.navItem}>
        <Ionicons name="home" size={20} color="teal" />
        <Text style={styles.navText}>Tenants</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(tabs)/transaction")} style={styles.navItem}>
        <Ionicons name="swap-horizontal" size={20} color="teal" />
        <Text style={styles.navText}>Transaction</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/chat")} style={styles.navItem}>
        <Ionicons name="chatbubble-ellipses" size={20} color="teal" />
        <Text style={styles.navText}>Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/bill")} style={styles.navItem}>
        <Ionicons name="document-text" size={20} color="teal" />
        <Text style={styles.navText}>Bill Management</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} style={styles.navItem}>
        <Ionicons name="settings" size={20} color="teal" />
        <Text style={styles.navText}>Profile Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/reciept")} style={styles.navItem}>
        <Ionicons name="language" size={20} color="teal" />
        <Text style={styles.navText}>Reciept</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.navItem}>
        <Ionicons name="log-out" size={20} color="teal" />
        <Text style={styles.navText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 250,
    height: "100%",
    backgroundColor: "white",
    padding: 20,
    elevation: 10,
    zIndex: 1000,
  },
  closeButton: {
    marginBottom: 15,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "teal",
    marginBottom: 20,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginVertical: 2,
  },
  navText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
});

export default Navbar;