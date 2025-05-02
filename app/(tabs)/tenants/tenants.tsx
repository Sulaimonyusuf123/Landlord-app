import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAllTenants, deleteTenantFromMock } from "../../../lib/mockData";
import type { Tenant } from "../../../lib/mockData";

const Tenants = () => {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const data = await getAllTenants();
      setTenants(data);
    } catch (error) {
      console.error("Failed to load tenants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleAddTenant = () => {
    router.push("/(tabs)/tenants/addTenant");
  };

  const handleViewTenant = (tenantId: string) => {
    router.push({
      pathname: "/(tabs)/tenants/tenant-details",
      params: { tenantId },
    });
  };

  const handleEditTenant = (tenantId: string) => {
    router.push({
      pathname: "/(tabs)/tenants/editTenant",
      params: { tenantId },
    });
  };

  const handleDeleteTenant = (tenantId: string) => {
    Alert.alert(
      "Delete Tenant",
      "Are you sure you want to delete this tenant?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTenantFromMock(tenantId);
              const updated = await getAllTenants();
              setTenants(updated);
              Alert.alert("Deleted", "Tenant has been deleted.");
            } catch (error) {
              Alert.alert("Error", "Failed to delete tenant.");
              console.error("Delete error:", error);
            }
          },
        },
      ]
    );
  };

  const renderTenant = ({ item }: { item: Tenant }) => (
    <TouchableOpacity
      onPress={() => handleViewTenant(item.id)}
      activeOpacity={0.85}
      style={styles.tenantCard}
    >
      <View style={styles.tenantInfo}>
        <Text style={styles.tenantName}>{item.name}</Text>
        <Text style={styles.tenantDetails}>{item.phone || "-"} | {item.email || "-"}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEditTenant(item.id)} style={styles.iconButton}>
          <Ionicons name="create-outline" size={20} color="#FFA500" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTenant(item.id)} style={styles.iconButton}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
      ) : (
        <FlatList
          data={tenants}
          keyExtractor={(item) => item.id}
          renderItem={renderTenant}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.noDataText}>No tenants found.</Text>}
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
  listContainer: { padding: 15 },
  noDataText: { textAlign: "center", color: "#666", marginTop: 30 },
  tenantCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  tenantInfo: { flex: 1 },
  tenantName: { fontSize: 16, fontWeight: "bold" },
  tenantDetails: { fontSize: 14, color: "#666", marginTop: 4 },
  actions: { flexDirection: "row" },
  iconButton: { marginLeft: 10 },
});
