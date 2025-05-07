// app/(tabs)/addExpense.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllProperties, createExpense } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/authService";
import type { Property } from "../../../lib/types";

const EXPENSE_TYPES = [
  "Electricity Bill",
  "Water Bill",
  "Internet Bill",
  "Guard Salary",
  "Elevator Maintenance",
  "Renovation Costs",
  "Other",
];

const AddExpense = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [expenseType, setExpenseType] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [expenseDate, setExpenseDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState<string>("");
  const [showExpenseOptions, setShowExpenseOptions] = useState(false);
  const [showPropertyOptions, setShowPropertyOptions] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error("User not found");
        setUserId(user.$id);

        const data = await getAllProperties(user.$id);
        setProperties(data);
      } catch (error) {
        console.error("Failed to load properties:", error);
        Alert.alert("Error", "Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSaveExpense = async () => {
    if (!expenseType) return Alert.alert("Error", "Please select an expense type.");
    if (!selectedPropertyId) return Alert.alert("Error", "Please select a property.");
    if (!amount || isNaN(Number(amount))) return Alert.alert("Error", "Please enter a valid amount.");
    if (!expenseDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return Alert.alert("Error", "Please enter a valid date in format YYYY-MM-DD.");
    }

    try {
      await createExpense({
        userId,
        propertyId: selectedPropertyId,
        unitId: selectedUnitId || undefined,
        amount: Number(amount),
        expenseType,
        expenseDate,
        notes,
      });

      Alert.alert("Success", "Expense saved successfully!");
      router.replace("/(tabs)/expenses/expenses");
    } catch (error) {
      console.error("Failed to save expense:", error);
      Alert.alert("Error", "Failed to save expense. Please try again.");
    }
  };

  const handleDateInput = (text: string) => {
    const cleaned = text.replace(/[^0-9-]/g, "");
    setExpenseDate(cleaned);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#17b8a6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/expenses/expenses")}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Expense Type</Text>
        <TouchableOpacity onPress={() => setShowExpenseOptions(!showExpenseOptions)} style={styles.dropdown}>
          <Text style={{ color: expenseType ? "#000" : "#aaa" }}>
            {expenseType || "Select Expense Type"}
          </Text>
        </TouchableOpacity>
        {showExpenseOptions && (
          <View style={styles.dropdownOptions}>
            {EXPENSE_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => {
                  setExpenseType(type);
                  setShowExpenseOptions(false);
                }}
                style={styles.dropdownItem}
              >
                <Text>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Property</Text>
        <TouchableOpacity onPress={() => setShowPropertyOptions(!showPropertyOptions)} style={styles.dropdown}>
          <Text style={{ color: selectedPropertyId ? "#000" : "#aaa" }}>
            {properties.find((p) => p.id === selectedPropertyId)?.name || "Select Property"}
          </Text>
        </TouchableOpacity>
        {showPropertyOptions && (
          <View style={styles.dropdownOptions}>
            {properties.map((property) => (
              <TouchableOpacity
                key={property.id}
                onPress={() => {
                  setSelectedPropertyId(property.id);
                  setShowPropertyOptions(false);
                }}
                style={styles.dropdownItem}
              >
                <Text>{property.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Amount (SAR)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
        />

        <Text style={styles.label}>Expense Date (Format: YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="Format: YYYY-MM-DD"
          value={expenseDate}
          onChangeText={handleDateInput}
        />

        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="Write any notes..."
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveExpense}>
          <Text style={styles.saveButtonText}>Save Expense</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#17b8a6",
    padding: 15,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
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
    padding: 15,
    marginBottom: 15,
  },
  dropdownOptions: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  saveButton: {
    backgroundColor: "#17b8a6",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
