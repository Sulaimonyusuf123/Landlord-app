// app/(tabs)/payments/addPayment.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllProperties, createPayment } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/authService";
import type { Property, Unit } from "../../../lib/types";

const AddPayment = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        setUserId(user?.$id || null);
        if (!user?.$id) return;

        const data = await getAllProperties(user.$id);
        setProperties(data);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectProperty = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setUnits([]); // Not handling units with Appwrite here yet
    setSelectedUnitId(null);
  };

  const handleSavePayment = async () => {
    if (!userId || !selectedPropertyId) {
      Alert.alert("Error", "Please select a property.");
      return;
    }
    if (!amountPaid || isNaN(Number(amountPaid))) {
      Alert.alert("Error", "Please enter a valid amount paid.");
      return;
    }

    try {
      await createPayment({
        propertyId: selectedPropertyId,
        unitId: selectedUnitId || undefined,
        amount: Number(amountPaid),
        paymentDate,
        notes,
        userId,
      });

      Alert.alert("Success", "Payment saved successfully!");
      router.replace("/(tabs)/payments/payments");
    } catch (err) {
      console.error("Failed to save payment:", err);
      Alert.alert("Error", "Failed to save payment.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#17b8a6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/payments/payments")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>Property</Text>
        <View style={styles.dropdown}>
          {properties.map((property) => (
            <TouchableOpacity
              key={property.id}
              style={[
                styles.dropdownItem,
                selectedPropertyId === property.id && styles.selectedDropdownItem,
              ]}
              onPress={() => handleSelectProperty(property.id)}
            >
              <Text>{property.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Amount Paid (SAR)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amountPaid}
          onChangeText={setAmountPaid}
          placeholder="Enter amount paid"
        />

        <Text style={styles.label}>Payment Date (Format: YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={paymentDate}
          onChangeText={setPaymentDate}
        />

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="Write any notes..."
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSavePayment}>
          <Text style={styles.saveButtonText}>Save Payment</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddPayment;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#17b8a6",
    padding: 15,
    elevation: 4,
  },
  backButton: { paddingRight: 10 },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 30,
  },
  formContainer: { padding: 20, paddingBottom: 50 },
  label: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 5 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 14,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 8,
    marginBottom: 15,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedDropdownItem: { backgroundColor: "#dff8eb" },
  saveButton: {
    backgroundColor: "#17b8a6",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
