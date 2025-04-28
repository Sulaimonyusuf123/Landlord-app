// app/(tabs)/tenants.tsx

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAllTenants, deleteTenantFromMock } from "../../lib/mockData";
import type { Tenant } from "../../lib/mockData";
import { useCallback } from "react";

const Tenants = () => {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const allTenants = await getAllTenants();
      setTenants(allTenants);
    } catch (error) {
      console.error("Failed to load tenants:", error);
      Alert.alert("Error", "Failed to load tenants.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTenants();
    }, [])
  );

  const toggleMenu = (tenantId: string) => {
    setActiveMenu(activeMenu === tenantId ? null : tenantId);
  };

  const handleAddTenant = () => {
    router.push("/(tabs)/addTenant");
  };

  const handleEditTenant = (tenantId: string) => {
    setActiveMenu(null);
    router.push(`/(tabs)/editTenant?tenantId=${tenantId}`);
  };

  const handleDeleteTenant = async (tenantId: string) => {
    Alert.alert(
      "Delete Tenant",
      "Are you sure you want to delete this tenant?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
          try {
            await deleteTenantFromMock(tenantId);
            await loadTenants();
            Alert.alert("Success", "Tenant deleted successfully");
          } catch (error) {
            console.error("Failed to delete tenant:", error);
            Alert.alert("Error", "Failed to delete tenant.");
          }
        }}
      ]
    );
  };

  const handleViewTenant = (tenantId: string) => {
    router.push(`/(tabs)/tenant-details?tenantId=${tenantId}`);
  };

  const renderTenantItem = ({ item }: { item: Tenant }) => (
    <View style={styles.tenantContainer}>
      <TouchableOpacity style={styles.tenantCard} onPress={() => handleViewTenant(item.id)}>
        <Ionicons name="person-circle-outline" size={40} color="#17b8a6" style={{ marginRight: 10 }} />
        <View style={styles.tenantInfo}>
          <Text style={styles.tenantName}>{item.name}</Text>
          <Text style={styles.tenantSubInfo}>
            {item.phone ? `📱 ${item.phone}` : "-"} | {item.email ? `📧 ${item.email}` : "-"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => toggleMenu(item.id)}>
          <Ionicons name="ellipsis-vertical" size={20} color="gray" />
        </TouchableOpacity>
      </TouchableOpacity>

      {activeMenu === item.id && (
        <View style={styles.actionMenu}>
          <TouchableOpacity style={styles.menuButton} onPress={() => handleEditTenant(item.id)}>
            <Text style={styles.menuButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuButton, { backgroundColor: "red" }]} onPress={() => handleDeleteTenant(item.id)}>
            <Text style={styles.menuButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tenants</Text>
        <TouchableOpacity onPress={handleAddTenant}>
          <Ionicons name="add-circle-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#17b8a6" />
        </View>
      ) : tenants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tenants found.</Text>
          <TouchableOpacity style={styles.addButtonEmpty} onPress={handleAddTenant}>
            <Text style={styles.addButtonText}>Add First Tenant</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={tenants}
          keyExtractor={(item) => item.id}
          renderItem={renderTenantItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default Tenants;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#17b8a6",
    padding: 15,
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "white" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#666", marginBottom: 10 },
  addButtonEmpty: {
    backgroundColor: "#17b8a6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: { color: "white", fontWeight: "bold" },
  list: { padding: 20 },
  tenantContainer: { marginBottom: 15 },
  tenantCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    elevation: 3,
  },
  tenantInfo: { flex: 1 },
  tenantName: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  tenantSubInfo: { fontSize: 14, color: "gray" },
  actionMenu: {
    marginTop: 5,
    backgroundColor: "#FFF",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
  },
  menuButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuButtonText: { color: "black", fontWeight: "600" },
});
