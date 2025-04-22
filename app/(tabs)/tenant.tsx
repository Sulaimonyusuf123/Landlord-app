import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router'; // Added useFocusEffect
import { useCallback } from 'react'; // Added useCallback
import { getTenants } from "../../lib/appwrite";

const Tenant = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tenantData, setTenantData] = useState([]);
  const placeholderImage = require("../../assets/images/build.png");

  // Load tenants from API
  const loadTenants = async () => {
    setLoading(true);
    try {
      const tenants = await getTenants();
      setTenantData(tenants);
      console.log("Tenants loaded successfully:", tenants);
    } catch (error) {
      console.error("Error loading tenants:", error);
      Alert.alert("Error", "Failed to load tenants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Refresh tenants when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTenants();
    }, [])
  );

  // Optional: Log new tenant addition (for debugging)
  useEffect(() => {
    if (params.newTenantAdded) {
      console.log("New tenant was just added!");
    }
  }, [params]);

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const goBack = () => {
    router.back();
  };

  const goToAddTenant = () => {
    router.push("/(tabs)/addTenant");
  };

  const handleUpdate = (tenant) => {
    setActiveMenu(null);
    router.push({
      pathname: "/(tabs)/update-tenant",
      params: { id: tenant.id }
    });
  };

  const handleDelete = (tenant) => {
    setActiveMenu(null);
    Alert.alert(
      "Delete Tenant",
      `Are you sure you want to delete ${tenant.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              // Assuming deleteTenant is implemented
              // await deleteTenant(tenant.id);
              const filteredTenants = tenantData.filter(t => t.id !== tenant.id);
              setTenantData(filteredTenants);
              console.log("Tenant deleted:", tenant.id);
              Alert.alert("Success", "Tenant deleted successfully");
            } catch (error) {
              console.error("Error deleting tenant:", error);
              Alert.alert("Error", "Failed to delete tenant. Please try again.");
            }
          }
        }
      ]
    );
  };

  const renderTenant = ({ item }) => {
    if (!item) return null;
    return (
      <View style={styles.tenantContainer}>
        <TouchableOpacity style={styles.tenantCard}>
          <Image 
            source={item.imageUrl ? { uri: item.imageUrl } : placeholderImage} 
            style={styles.tenantImage} 
            contentFit="contain" 
          />
          <View style={styles.tenantInfo}>
            <Text style={styles.tenantTitle}>{item.name || "Unknown Name"}</Text>
            <Text style={styles.tenantDetails}>
              📧 {item.email || "No email"} • 📱 {item.phone || "No phone"}
            </Text>
            <Text style={styles.tenantDetails}>
              📍 {item.state || "No state provided"}{item.city ? `, ${item.city}` : ""}
            </Text>
          </View>
          <TouchableOpacity onPress={() => toggleMenu(item.id)}>
            <Ionicons name="ellipsis-vertical" size={20} color="black" />
          </TouchableOpacity>
        </TouchableOpacity>
        
        {activeMenu === item.id && (
          <View style={styles.actionMenu}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleUpdate(item)}
            >
              <Ionicons name="create-outline" size={16} color="#17b8a6" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDelete(item)}
            >
              <Ionicons name="trash-outline" size={16} color="#ff4d4f" />
              <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Tenants</Text>
        <TouchableOpacity style={styles.addButton} onPress={goToAddTenant}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tenantData}
        renderItem={renderTenant}
        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Tenant List</Text>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tenants found</Text>
              <TouchableOpacity 
                style={styles.emptyAddButton}
                onPress={goToAddTenant}
              >
                <Text style={styles.emptyAddButtonText}>Add your first tenant</Text>
              </TouchableOpacity>
            </View>
          )
        }
        refreshing={loading}
        onRefresh={loadTenants}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#17b8a6',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  addButton: {
    padding: 5,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginTop: 15,
    marginBottom: 10,
  },
  tenantContainer: {
    position: 'relative',
    marginVertical: 5,
  },
  tenantCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#FFFFFF", 
    padding: 15, 
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tenantImage: { 
    width: 40, 
    height: 40, 
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  tenantInfo: { 
    flex: 1,
  },
  tenantTitle: { 
    fontSize: 16, 
    fontWeight: "600",
    color: '#333',
  },
  tenantDetails: { 
    fontSize: 14, 
    color: "gray",
  },
  actionMenu: {
    position: 'absolute',
    top: 10,
    right: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 5,
    width: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 100,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
  },
  deleteText: {
    color: '#ff4d4f',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  emptyAddButton: {
    backgroundColor: '#17b8a6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default Tenant;