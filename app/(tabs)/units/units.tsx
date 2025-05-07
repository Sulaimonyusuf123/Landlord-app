
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getUnitsOfProperty, deleteUnit } from "../../../lib/db";
import { useAuth } from "../../../lib/authService";
import { Unit } from "../../../lib/types";

const Units = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
  const [units, setUnits] = useState<Unit[]>([]);

  const loadUnits = async () => {
    if (!user) return;
    const data = await getUnitsOfProperty(propertyId!, user.$id);
    setUnits(data);
  };

  useEffect(() => {
    loadUnits();
  }, [propertyId]);

  const handleDeleteUnit = (unitId: string) => {
    Alert.alert("Delete Unit", "Are you sure you want to delete this unit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!user) return;
          await deleteUnit(unitId);
          loadUnits();
        },
      },
    ]);
  };

  const renderUnit = ({ item }: { item: Unit }) => (
    <TouchableOpacity
      style={styles.unitCard}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/units/unit-details",
          params: { propertyId, unitId: item.id },
        })
      }
    >
      <View style={styles.unitInfo}>
        <Text style={styles.unitTitle}>Unit #{item.unitNumber || item.id}</Text>
        <Text style={styles.unitDetails}>
          Size: {item.size} m² • Rent: {item.rentAmount} SAR
        </Text>
        <Text style={styles.unitDetails}>
          Rooms: {item.bedrooms} • Baths: {item.bathrooms}
        </Text>
        <Text style={styles.unitStatus}>
          {item.status === "occupied" ? "🟢 Occupied" : "🔘 Vacant"}
        </Text>
      </View>
      <TouchableOpacity onPress={() => router.push({
        pathname: "/(tabs)/units/editUnit",
        params: { propertyId, unitId: item.id }
      })} style={styles.iconButton}>
        <Ionicons name="create-outline" size={20} color="#FFA500" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteUnit(item.id)} style={styles.iconButton}>
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Units</Text>
        <TouchableOpacity onPress={() => router.push({
          pathname: "/(tabs)/units/addUnit",
          params: { propertyId }
        })}>
          <Ionicons name="add-circle-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {units.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No units found for this property.</Text>
        </View>
      ) : (
        <FlatList
          data={units}
          keyExtractor={(item) => item.id}
          renderItem={renderUnit}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default Units;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#17b8a6",
    padding: 15,
    alignItems: "center",
  },
  headerText: { fontSize: 18, fontWeight: "bold", color: "white" },
  listContainer: { padding: 15 },
  unitCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  unitInfo: { flex: 1 },
  unitTitle: { fontSize: 16, fontWeight: "bold" },
  unitDetails: { fontSize: 14, color: "#666", marginTop: 4 },
  unitStatus: { fontSize: 14, fontWeight: "600", marginTop: 4, color: "#17b8a6" },
  iconButton: { marginLeft: 10 },
  emptyContainer: { alignItems: "center", marginTop: 30 },
  emptyText: { fontSize: 16, color: "#999" },
});
