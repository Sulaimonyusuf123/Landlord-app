// app/(tabs)/dashboard.tsx

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Navbar from "../(tabs)/navbar";
import { getAllProperties, deletePropertyFromMock } from "../../lib/mockData";
import type { Property } from "../../lib/mockData";

const Dashboard = () => {
  const router = useRouter();
  const [navVisible, setNavVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const images = {
    addNew: require("../../assets/images/addnew.png"),
    payReport: require("../../assets/images/payreport.png"),
    addTenant: require("../../assets/images/addten.png"),
    building: require("../../assets/images/build.png"),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertyData = await getAllProperties();
        setProperties(propertyData);
      } catch (error) {
        console.error("Error loading properties:", error);
        Alert.alert("Error", "Failed to load properties");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshProperties = async () => {
    try {
      const updatedProperties = await getAllProperties();
      setProperties(updatedProperties);
    } catch (error) {
      console.error("Error refreshing properties:", error);
    }
  };

  const closeNav = () => setNavVisible(false);
  const toggleNav = () => setNavVisible(!navVisible);

  const handleOpenMenu = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setMenuVisible(true);
  };

  const handleDeleteProperty = () => {
    if (!selectedPropertyId) return;

    Alert.alert(
      "Delete Property",
      "Are you sure you want to delete this property?",
      [
        { text: "Cancel", style: "cancel", onPress: () => setMenuVisible(false) },
        { text: "Delete", style: "destructive", onPress: () => handleConfirmedDelete(selectedPropertyId) }
      ]
    );
  };

  const handleConfirmedDelete = async (idToDelete: string) => {
    try {
      setDeleteLoading(true);
      setMenuVisible(false);

      await deletePropertyFromMock(idToDelete);

      await refreshProperties();

      Alert.alert("Success", "Property deleted successfully");
    } catch (error) {
      console.error("Error deleting property:", error);
      Alert.alert("Error", "Failed to delete property");
    } finally {
      setDeleteLoading(false);
      setSelectedPropertyId(null);
    }
  };

  const calculateSummary = () => {
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalOperatingCosts = 0;
    let totalUnits = 0;
    let occupiedUnits = 0;
    let vacantUnits = 0;

    properties.forEach((property) => {
      totalIncome += property.income || 0;
      totalExpenses += property.expenses || 0;
      totalOperatingCosts += property.operatingCosts || 0;

      if (property.units && property.units.length > 0) {
        totalUnits += property.units.length;
        occupiedUnits += property.units.filter((unit) => unit.status === "occupied").length;
        vacantUnits += property.units.filter((unit) => unit.status === "vacant").length;
      }
    });

    const netProfit = totalIncome - (totalExpenses + totalOperatingCosts);

    return { totalIncome, totalExpenses, totalOperatingCosts, netProfit, totalUnits, occupiedUnits, vacantUnits };
  };

  const { totalIncome, totalExpenses, totalOperatingCosts, netProfit, totalUnits, occupiedUnits, vacantUnits } = calculateSummary();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#17b8a6" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
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
            <TouchableOpacity onPress={() => router.push("/(tabs)/notification")} style={styles.headerIcon}>
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
        </View>

        {/* If no properties exist, show Add First Property */}
        {properties.length === 0 && (
          <View style={styles.noProperties}>
            <Text style={styles.noPropertiesText}>You don't have any properties yet.</Text>
            <TouchableOpacity 
              style={styles.addPropertyButton}
              onPress={() => router.push("/(tabs)/addProperty")}
            >
              <Text style={styles.addPropertyButtonText}>+ Add Your First Property</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push("/(tabs)/addPayment")}
          >
            <Ionicons name="cash-outline" size={28} color="#17b8a6" />
            <Text style={styles.actionText}>Add Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push("/(tabs)/addExpense")}
          >
            <Ionicons name="receipt-outline" size={28} color="#17b8a6" />
            <Text style={styles.actionText}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text>Total Properties</Text>
            <Text style={styles.count}>{properties.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text>Total Units</Text>
            <Text style={styles.count}>{totalUnits}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text>Units Occupied</Text>
            <Text style={styles.count}>{occupiedUnits}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text>Units Vacant</Text>
            <Text style={styles.count}>{vacantUnits}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text>Total Income</Text>
            <Text style={styles.count}>{totalIncome.toLocaleString()} SAR</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text>Total Expenses</Text>
            <Text style={styles.count}>{totalExpenses.toLocaleString()} SAR</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text>Operating Costs</Text>
            <Text style={styles.count}>{totalOperatingCosts.toLocaleString()} SAR</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text>Net Profit</Text>
            <Text style={[styles.count, { color: netProfit >= 0 ? "#17b8a6" : "red" }]}>
              {netProfit.toLocaleString()} SAR
            </Text>
          </View>
        </View>
        {/* Recent Activities */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>

        {/* لو عندنا أنشطة نعرضها هنا */}
        <View style={styles.activityContainer}>
          {/* حاليا ماعندنا أنشطة حقيقية فنعرض رسالة افتراضية */}
          <Text style={styles.noActivitiesText}>No recent activities yet.</Text>
        </View>

      </ScrollView>

      {/* Action menu modal (لو تحتاجه مستقبلا لحذف أو تعديل عقار) */}
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
              onPress={handleDeleteProperty}
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
    justifyContent: "space-around", 
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  quickAction: { 
    alignItems: "center", 
    padding: 10, 
    backgroundColor: "#f5f5f5", 
    borderRadius: 10, 
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
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
    marginBottom: 5,
    paddingHorizontal: 15
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
    fontSize: 16,
  },
  activityContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
  },
  noActivitiesText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
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

