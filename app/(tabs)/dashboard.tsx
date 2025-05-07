// app/(tabs)/dashboard.tsx

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Navbar from "../(tabs)/navbar";
import { getAllProperties, deleteProperty } from "../../lib/db";
import { useAuth } from "../../lib/authService";
import type { Property } from "../../lib/types";

const Dashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [navVisible, setNavVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    try {
      const propertyData = await getAllProperties(user.$id);
      setProperties(propertyData);
    } catch (error) {
      console.error("Error loading properties:", error);
      Alert.alert("Error", "Failed to load properties");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProperties = async () => {
    if (!user) return;
    try {
      const updatedProperties = await getAllProperties(user.$id);
      setProperties(updatedProperties);
    } catch (error) {
      console.error("Error refreshing properties:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

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
      await deleteProperty(idToDelete);
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#17b8a6" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#666" }}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, position: "relative" }}>
      {navVisible && <Navbar closeNav={closeNav} />}
      {deleteLoading && (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)', justifyContent: 'center',
          alignItems: 'center', zIndex: 999
        }}>
          <ActivityIndicator size="large" color="#17b8a6" />
          <Text style={{ marginTop: 10, fontSize: 16, color: "#666" }}>Deleting property...</Text>
        </View>
      )}

      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#17b8a6", padding: 15, marginBottom: 10 }}>
          <TouchableOpacity onPress={toggleNav}>
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, color: "white", fontWeight: "bold" }}>Dashboard</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/notification")}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={{ padding: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Welcome back!</Text>
        </View>

        {properties.length === 0 && (
          <View style={{ padding: 30, alignItems: "center", backgroundColor: "#f5f5f5", margin: 15, borderRadius: 10 }}>
            <Text style={{ fontSize: 16, color: "#666", marginBottom: 15 }}>You don't have any properties yet.</Text>
            <TouchableOpacity
              style={{ backgroundColor: "#17b8a6", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }}
              onPress={() => router.push("/(tabs)/properties/addProperty")}
            >
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>+ Add Your First Property</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 15, paddingHorizontal: 15 }}>
          <TouchableOpacity
            style={{ alignItems: "center", padding: 10, backgroundColor: "#f5f5f5", borderRadius: 10, width: 120 }}
            onPress={() => router.push("/(tabs)/payments/addPayment")}
          >
            <Ionicons name="cash-outline" size={28} color="#17b8a6" />
            <Text style={{ fontSize: 12, marginTop: 5, textAlign: "center" }}>Add Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignItems: "center", padding: 10, backgroundColor: "#f5f5f5", borderRadius: 10, width: 120 }}
            onPress={() => router.push("/(tabs)/expenses/addExpense")}
          >
            <Ionicons name="receipt-outline" size={28} color="#17b8a6" />
            <Text style={{ fontSize: 12, marginTop: 5, textAlign: "center" }}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 15 }}>
          {[
            ["Total Properties", properties.length],
            ["Total Units", totalUnits],
            ["Units Occupied", occupiedUnits],
            ["Units Vacant", vacantUnits],
            ["Total Income", `${totalIncome.toLocaleString()} SAR`],
            ["Total Expenses", `${totalExpenses.toLocaleString()} SAR`],
            ["Operating Costs", `${totalOperatingCosts.toLocaleString()} SAR`],
            ["Net Profit", `${netProfit.toLocaleString()} SAR`]
          ].map(([label, value], i) => (
            <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "#dff8eb", padding: 15, marginVertical: 5, borderRadius: 10 }}>
              <Text>{label}</Text>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: label === "Net Profit" ? (netProfit >= 0 ? "#17b8a6" : "red") : "#17b8a6" }}>{value}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 15, marginBottom: 5, paddingHorizontal: 15 }}>Recent Activity</Text>

        <View style={{ backgroundColor: "#f5f5f5", padding: 15, marginHorizontal: 15, marginTop: 10, borderRadius: 10 }}>
          <Text style={{ fontSize: 14, color: "#666", textAlign: "center" }}>No recent activities yet.</Text>
        </View>
      </ScrollView>

      <Modal transparent animationType="fade" visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={{
            width: '80%', backgroundColor: 'white', borderRadius: 10, overflow: 'hidden',
            elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25, shadowRadius: 3.84
          }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }} onPress={handleDeleteProperty}>
              <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
              <Text style={{ marginLeft: 10, color: '#ff4d4d', fontWeight: '500', fontSize: 16 }}>Delete Property</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }} onPress={() => setMenuVisible(false)}>
              <Ionicons name="close-outline" size={24} color="#666" />
              <Text style={{ marginLeft: 10, color: '#666', fontWeight: '500', fontSize: 16 }}>Cancel</Text>
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