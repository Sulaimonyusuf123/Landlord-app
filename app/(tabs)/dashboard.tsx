import React, { useState, useEffect } from "react";
import { View, Text,  StyleSheet,   ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from 'react';
import Navbar from "../(tabs)/navbar";
import { getCurrentUser, logoutUser, getProperties, deleteProperty, getTenants } from "../../lib/appwrite";

const Dashboard = () => {
  const router = useRouter();
  const [navVisible, setNavVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // Add new state for tenant count
  const [tenantCount, setTenantCount] = useState(0);
  const [tenantsLoading, setTenantsLoading] = useState(false);

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

  // Fetch properties and tenants when dashboard comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setPropertiesLoading(true);
          setTenantsLoading(true);
          
          // Fetch properties
          const propertyData = await getProperties();
          setProperties(propertyData);
          
          // Fetch tenants to get the count
          const tenantData = await getTenants();
          setTenantCount(tenantData.length);
          
        } catch (error) {
          console.error("Error fetching data:", error);
          Alert.alert("Error", "Failed to load dashboard data");
        } finally {
          setPropertiesLoading(false);
          setTenantsLoading(false);
        }
      };

      if (user) {
        fetchData();
      }
      
      return () => {
        // Clean up if needed
      };
    }, [user])
  );

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

  const closeNav = () => {
    setNavVisible(false);
  };

  const toggleNav = () => {
    setNavVisible(!navVisible);
  };

  // Handle opening the menu for a specific property
  const handleOpenMenu = (propertyId) => {
    console.log("Opening menu for property:", propertyId);
    console.log("Property ID type:", typeof propertyId);
    // Always convert to string for consistency
    setSelectedPropertyId(String(propertyId));
    setMenuVisible(true);
  };

  // Handle delete property
  const handleDeleteProperty = () => {
    console.log("handleDeleteProperty called with ID:", selectedPropertyId);
    
    if (!selectedPropertyId) {
      console.error("No property ID selected for deletion");
      return;
    }
  
    Alert.alert(
      "Delete Property",
      "Are you sure you want to delete this property? This action cannot be undone.",
      [
        { 
          text: "Cancel", 
          style: "cancel", 
          onPress: () => {
            console.log("Delete cancelled");
            setMenuVisible(false);
          }
        },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            console.log("Delete confirmed for ID:", selectedPropertyId);
            // Call deleteProperty directly to avoid issues with the confirmDelete function
            handleConfirmedDelete(selectedPropertyId);
          }
        }
      ]
    );
  };
  
  // Separate function to handle the confirmed deletion
  const handleConfirmedDelete = async (idToDelete) => {
    console.log("Starting deletion process for ID:", idToDelete);
    
    try {
      setDeleteLoading(true);
      setMenuVisible(false);
      
      // Convert ID to string explicitly
      const stringId = String(idToDelete);
      console.log("Stringified ID for deletion:", stringId);
      
      // Call the deleteProperty function directly
      await deleteProperty(stringId);
      console.log("Property deleted successfully on server");
      
      // Update the UI after successful deletion
      setProperties(prevProperties => 
        prevProperties.filter(property => String(property.id) !== stringId)
      );
      
      Alert.alert("Success", "Property deleted successfully");
    } catch (error) {
      console.error("Delete property error details:", error);
      
      // Show a more detailed error message
      let errorMessage = "Failed to delete property";
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      Alert.alert("Error", errorMessage);
      
      // Try to refresh the properties list if deletion failed
      try {
        console.log("Attempting to refresh properties after error");
        const updatedProperties = await getProperties();
        setProperties(updatedProperties);
      } catch (refreshError) {
        console.error("Error refreshing properties:", refreshError);
      }
    } finally {
      setDeleteLoading(false);
      setSelectedPropertyId(null);
    }
  };

  const images = {
    addNew: require("../../assets/images/addnew.png"),
    payReport: require("../../assets/images/payreport.png"),
    addTenant: require("../../assets/images/addten.png"),
    building: require("../../assets/images/build.png"),
  };

  // Rest of your render logic remains the same
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#17b8a6" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (!user) {
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
      {navVisible && <Navbar closeNav={closeNav} />}

      {/* Delete loading overlay */}
      {deleteLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#17b8a6" />
          <Text style={styles.loadingText}>Deleting property...</Text>
        </View>
      )}

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
            <Text style={styles.count}>{properties?.length || 0}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text>Total Tenants</Text>
            {tenantsLoading ? (
              <ActivityIndicator size="small" color="#17b8a6" />
            ) : (
              <Text style={styles.count}>{tenantCount}</Text>
            )}
          </View>
          <View style={styles.summaryCard}>
            <Text>Vacant Units</Text>
            <Text style={styles.count}>5</Text>
          </View>
        </View>

        {/* Property List */}
        <Text style={styles.sectionTitle}>Properties</Text>
        
        {propertiesLoading ? (
          <View style={styles.loadingProperties}>
            <ActivityIndicator size="small" color="#17b8a6" />
            <Text style={styles.loadingText}>Loading properties...</Text>
          </View>
        ) : properties.length === 0 ? (
          <View style={styles.noProperties}>
            <Text style={styles.noPropertiesText}>No properties added yet</Text>
            <TouchableOpacity 
              style={styles.addPropertyButton}
              onPress={() => router.replace("/(tabs)/addProperties")}
            >
              <Text style={styles.addPropertyButtonText}>Add Your First Property</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Map through properties
          properties.map((property, index) => (
            <View key={property.id || index} style={styles.propertyCard}>
              <Image 
                source={property.imageUrl ? { uri: property.imageUrl } : images.building} 
                style={styles.propertyImage} 
                contentFit="contain" 
              />
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle}>{property.propertyName || "Unnamed Property"}</Text>
                <Text style={styles.propertyDetails}>
                  🏡 {property.propertyType || "N/A"} • 🔴 {property.category || "Uncategorized"}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleOpenMenu(property.id)}
                style={styles.menuButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="ellipsis-vertical" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Action menu modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                console.log("Delete button pressed for property:", selectedPropertyId);
                handleDeleteProperty();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
              <Text style={styles.deleteText}>Delete Property</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => setMenuVisible(false)}
              activeOpacity={0.7}
            >
              <Ionicons name="close-outline" size={24} color="#666" />
              <Text style={styles.menuText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};


// Your existing styles remain the same
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingProperties: {
    padding: 20,
    alignItems: "center",
  },
  noProperties: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    margin: 15,
    borderRadius: 10,
  },
  noPropertiesText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  addPropertyButton: {
    backgroundColor: "#17b8a6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addPropertyButtonText: {
    color: "white",
    fontWeight: "bold",
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
    marginRight: 10,
    borderRadius: 5
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
  menuButton: {
    padding: 10,
    marginLeft: 5,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  deleteText: {
    marginLeft: 10,
    color: '#ff4d4d',
    fontWeight: '500',
    fontSize: 16,
  },
  menuText: {
    marginLeft: 10,
    color: '#666',
    fontWeight: '500',
    fontSize: 16,
  }
});

export default Dashboard;