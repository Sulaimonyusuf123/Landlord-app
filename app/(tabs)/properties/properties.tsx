import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllProperties, deletePropertyFromMock } from "../../../lib/mockData";
import type { Property } from "../../../lib/mockData";

const Properties = () => {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // لإجبار إعادة التحميل بعد الحذف

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await getAllProperties();
        setProperties(data);
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [refreshKey]);

  const handleAddProperty = () => {
    router.push("/(tabs)/properties/addProperty");
  };

  const handleViewProperty = (property: Property) => {
    if (property.type === "building") {
      router.push({
        pathname: "/(tabs)/units/units",
        params: { propertyId: property.id },
      });
    } else {
      router.push({
        pathname: "/(tabs)/properties/property-details",
        params: { propertyId: property.id },
      });
    }
  };

  const handleEditProperty = (propertyId: string) => {
    router.push({ pathname: "/(tabs)/properties/editProperty", params: { propertyId } });
  };

  const handleDeleteProperty = async (propertyId: string) => {
    Alert.alert(
      "Delete Property",
      "Are you sure you want to delete this property?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePropertyFromMock(propertyId);
              setRefreshKey(prev => prev + 1); // تحديث المفتاح لإعادة التحميل
              Alert.alert("Deleted", "Property has been deleted.");
            } catch (error) {
              console.error("Failed to delete property:", error);
              Alert.alert("Error", "Failed to delete property.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Properties</Text>
        <TouchableOpacity onPress={handleAddProperty}>
          <Ionicons name="add-circle-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#17b8a6" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer} key={refreshKey}>
          {properties.length === 0 ? (
            <Text style={styles.noDataText}>No properties found.</Text>
          ) : (
            properties.map((property) => (
              <View key={property.id} style={styles.propertyCard}>
                <TouchableOpacity onPress={() => handleViewProperty(property)} activeOpacity={0.8}>
                  <Text style={styles.propertyName}>{property.name}</Text>
                  <Text style={styles.propertyType}>{property.type}</Text>
                </TouchableOpacity>

                <View style={styles.buttonRow}>
                  <TouchableOpacity onPress={() => handleEditProperty(property.id)} style={styles.button}>
                    <Ionicons name="create-outline" size={20} color="#FFA500" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteProperty(property.id)} style={styles.button}>
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Properties;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#17b8a6",
    padding: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 15,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 30,
    color: "#666",
  },
  propertyCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  propertyType: {
    fontSize: 14,
    color: "#666",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-end",
  },
  button: {
    marginLeft: 10,
  },
});
