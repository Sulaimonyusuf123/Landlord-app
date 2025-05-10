// app/(tabs)/tenant-details.tsx

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getTenantById, deleteTenant } from "../../../lib/db";
import { useAuth } from "../../../lib/authService";
import type { Tenant } from "../../../lib/types";

const TenantDetails = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { tenantId } = useLocalSearchParams<{ tenantId: string }>();

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenantId && user) fetchTenant();
  }, [tenantId, user]);

  const fetchTenant = async () => {
    try {
      setLoading(true);
      const tenantData = await getTenantById(tenantId!, user!.$id);
      setTenant(tenantData || null);
    } catch (error) {
      console.error("Failed to load tenant:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTenant = () => {
    router.push(`/(tabs)/tenants/editTenant?tenantId=${tenantId}`);
  };

  const handleDeleteTenant = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this tenant?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTenant(tenantId!);
              Alert.alert("Deleted", "Tenant deleted successfully!");
              router.replace("/(tabs)/tenants/tenants");
            } catch (error) {
              console.error("Failed to delete tenant:", error);
              Alert.alert("Error", "Failed to delete tenant.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#17b8a6" />
      </View>
    );
  }

  if (!tenant) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Tenant not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Tenant Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {tenant.imageUrl && (
          <Image source={{ uri: tenant.imageUrl }} style={styles.image} />
        )}
        <Text style={styles.detailText}>Name: {tenant.name}</Text>
        <Text style={styles.detailText}>Email: {tenant.email}</Text>
        <Text style={styles.detailText}>Phone: {tenant.phone}</Text>
        <Text style={styles.detailText}>State: {tenant.state || '-'}</Text>
        <Text style={styles.detailText}>City: {tenant.city || '-'}</Text>

        <TouchableOpacity style={styles.button} onPress={handleEditTenant}>
          <Text style={styles.buttonText}>Edit Tenant</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleDeleteTenant}>
          <Text style={styles.buttonText}>Delete Tenant</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default TenantDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F7FA",
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#17b8a6",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: "#ccc",
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#17b8a6",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: "red",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
