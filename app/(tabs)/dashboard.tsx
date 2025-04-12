import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Navbar from "../(tabs)/navbar"; // Adjust path if needed
import { getCurrentUser, logoutUser } from "../../lib/appwrite";

const Dashboard = () => {
  const router = useRouter();
  const [navVisible, setNavVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch current user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Logout Failed", "Please try again later.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Define closeNav as a proper function reference
  const closeNav = () => {
    console.log("closeNav called in Dashboard"); // For debugging
    setNavVisible(false);
  };

  // Function to toggle navbar visibility
  const toggleNav = () => {
    console.log("Toggle navbar, current state:", navVisible);
    setNavVisible(!navVisible);
  };

  // Define your image assets using Expo's asset system
  const images = {
    addNew: require("../../assets/images/addnew.png"),
    payReport: require("../../assets/images/payreport.png"),
    addTenant: require("../../assets/images/addten.png"),
    building: require("../../assets/images/build.png"),
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#17b8a6" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  // Redirect to login if no user is found
  if (!user) {
    // Instead of immediately redirecting, we can show a message
    // and provide a button to go to the login screen
    return (
      <View style={styles.authErrorContainer}>
        <Text style={styles.authErrorText}>
          Please log in to access your dashboard.
        </Text>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.authButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Render Navbar as an overlay when visible */}
      {navVisible && <Navbar closeNav={closeNav} />}

      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleNav}>
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.replace("/(tabs)/notification")} style={styles.headerIcon}>
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
           
          </View>
        </View>

       
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hi {user.name || "User"}</Text>
          <Text>Welcome Back</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity onPress={() => router.replace("/(tabs)/addProperties")} style={styles.quickAction}>
            <Image source={images.addNew} style={styles.icon} />
            <Text style={styles.actionText}>AddProperty</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/(tabs)/paymentReport")} style={styles.quickAction}>
            <Image source={images.payReport} style={styles.icon} />
            <Text style={styles.actionText}>PaymentReport</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/(tabs)/addTenant")} style={styles.quickAction}>
            <Image source={images.addTenant} style={styles.icon} />
            <Text style={styles.actionText}>AddTenant</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text>Total Property</Text>
            <Text style={styles.count}>10</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text>Total Tenants</Text>
            <Text style={styles.count}>21</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text>Vacant Units</Text>
            <Text style={styles.count}>5</Text>
          </View>
        </View>

        {/* Property List */}
        <Text style={styles.sectionTitle}>Properties</Text>
        <View style={styles.propertyCard}>
          <Image source={images.building} style={styles.propertyImage} contentFit="contain" />
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyTitle}>3 Bedroom Flat</Text>
            <Text style={styles.propertyDetails}>🏡 Rent • 🔴 Residential</Text>
          </View>
          <View>
            <Ionicons name="ellipsis-vertical" size={20} color="black" />
          </View>
        </View>

        <View style={styles.propertyCard}>
          <Image source={images.building} style={styles.propertyImage} contentFit="contain" />
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyTitle}>4 Bedroom Flat</Text>
            <Text style={styles.propertyDetails}>🏡 Rent • 🔴 Residential</Text>
          </View>
          <View>
            <Ionicons name="ellipsis-vertical" size={20} color="black" />
          </View>
        </View>

        <View style={styles.propertyCard}>
          <Image source={images.building} style={styles.propertyImage} contentFit="contain" />
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyTitle}>2 Bedroom Flat</Text>
            <Text style={styles.propertyDetails}>🏡 Rent • 🔴 Residential</Text>
          </View>
          <View>
            <Ionicons name="ellipsis-vertical" size={20} color="black" />
          </View>
        </View>

        <View style={styles.propertyCard}>
          <Image source={images.building} style={styles.propertyImage} contentFit="contain" />
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyTitle}>3 Bedroom Flat</Text>
            <Text style={styles.propertyDetails}>🏡 Rent • 🔴 Residential</Text>
          </View>
          <View>
            <Ionicons name="ellipsis-vertical" size={20} color="black" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Updated styles to include mainContainer and auth-related styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: "relative",
  },
  container: { 
    flex: 1, 
    backgroundColor: "#fff"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  authErrorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  authErrorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  authButton: {
    backgroundColor: "#17b8a6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  authButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    backgroundColor: "#17b8a6", 
    padding: 15,
    marginBottom: 10
  },
  headerTitle: { 
    fontSize: 18, 
    color: "white", 
    fontWeight: "bold" 
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginLeft: 15,
  },
  welcomeContainer: { 
    padding: 15 
  },
  welcomeText: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  quickActions: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  quickAction: { 
    alignItems: "center", 
    padding: 10, 
    backgroundColor: "#f5f5f5", 
    borderRadius: 10, 
    width: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  icon: { 
    width: 40, 
    height: 40
  },
  actionText: { 
    fontSize: 12, 
    marginTop: 5, 
    textAlign: "center" 
  },
  summaryContainer: { 
    marginBottom: 10,
    paddingHorizontal: 15
  },
  summaryCard: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    backgroundColor: "#dff8eb", 
    padding: 15, 
    marginVertical: 5, 
    borderRadius: 10 
  },
  count: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#17b8a6" 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginTop: 15,
    paddingHorizontal: 15
  },
  propertyCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#f5f5f5", 
    padding: 15, 
    borderRadius: 10, 
    marginVertical: 5,
    marginHorizontal: 15
  },
  propertyImage: { 
    width: 40, 
    height: 40, 
    marginRight: 10
  },
  propertyInfo: { 
    flex: 1 
  },
  propertyTitle: { 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  propertyDetails: { 
    fontSize: 14, 
    color: "gray" 
  },
});

export default Dashboard;