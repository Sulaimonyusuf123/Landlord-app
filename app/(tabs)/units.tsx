import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import mockProperties from "../../lib/mockData"; // بيانات العقارات والوحدات

const Units = () => {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams();
  const [units, setUnits] = useState([]);

  useEffect(() => {
    if (propertyId) {
      const selected = mockProperties.find((p) => p.id === propertyId);
      setUnits(selected?.units || []);
    }
  }, [propertyId]);

  const goToAddUnit = () => {
    router.push({ pathname: "/(tabs)/addUnit", params: { propertyId } });
  };

  const renderUnit = ({ item }) => (
    <View style={styles.unitCard}>
      <Image
        source={item.imageUrl ? { uri: item.imageUrl } : require("../../assets/images/build.png")}
        style={styles.unitImage}
        contentFit="cover"
      />
      <View style={styles.unitInfo}>
        <Text style={styles.unitTitle}>Unit #{item.unitNumber}</Text>
        <Text style={styles.unitDetails}>Size: {item.size} m² • Rent: {item.rent} SAR</Text>
        <Text style={styles.unitDetails}>Rooms: {item.bedrooms} • Baths: {item.bathrooms}</Text>
        <Text style={styles.unitStatus}>{item.tenant ? "🟢 Occupied" : "🔘 Vacant"}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Units</Text>
        <TouchableOpacity onPress={goToAddUnit} style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {units.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No units found for this property.</Text>
          <TouchableOpacity onPress={goToAddUnit} style={styles.emptyAddButton}>
            <Text style={styles.emptyAddButtonText}>Add your first unit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={units}
          renderItem={renderUnit}
          keyExtractor={(item) => item.unitNumber?.toString() || Math.random().toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default Units;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: "#17b8a6",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    flex: 1,
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    padding: 5,
  },
  list: {
    padding: 20,
  },
  unitCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unitImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  unitInfo: {
    flex: 1,
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  unitDetails: {
    fontSize: 14,
    color: "gray",
  },
  unitStatus: {
    fontSize: 14,
    color: "#17b8a6",
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  emptyAddButton: {
    backgroundColor: "#17b8a6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
