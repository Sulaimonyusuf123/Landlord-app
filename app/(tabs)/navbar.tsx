import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { logoutUser } from "../../lib/appwrite";

interface NavbarProps {
  closeNav: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ closeNav }) => {
  const router = useRouter();

  const handleCloseButton = () => {
    closeNav();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} activeOpacity={0.5} onPress={handleCloseButton}>
        <Ionicons name="close" size={30} color="black" />
      </TouchableOpacity>

      <Text style={styles.logo}>MALIK</Text>

      <TouchableOpacity onPress={() => router.replace("/(tabs)/dashboard")} style={styles.navItem}>
        <Ionicons name="grid" size={20} color="teal" />
        <Text style={styles.navText}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(tabs)/properties/properties")} style={styles.navItem}>
        <Ionicons name="home" size={20} color="teal" />
        <Text style={styles.navText}>Properties</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(tabs)/payments/payments")} style={styles.navItem}>
        <Ionicons name="cash" size={20} color="teal" />
        <Text style={styles.navText}>Payments</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(tabs)/expenses/expenses")} style={styles.navItem}>
        <Ionicons name="receipt" size={20} color="teal" />
        <Text style={styles.navText}>Expenses</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(tabs)/tenants/tenants")} style={styles.navItem}>
        <Ionicons name="people" size={20} color="teal" />
        <Text style={styles.navText}>Tenants</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(tabs)/payments/paymentReport")} style={styles.navItem}>
        <Ionicons name="analytics" size={20} color="teal" />
        <Text style={styles.navText}>Payment Report</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} style={styles.navItem}>
        <Ionicons name="person" size={20} color="teal" />
        <Text style={styles.navText}>Profile</Text>
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
