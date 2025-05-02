// app/(tabs)/addPayment.tsx

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllProperties, savePaymentToMock } from "../../../lib/mockData"; 
import type { Property, Unit } from "../../../lib/mockData";

const AddPayment = () => {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [monthlyRent, setMonthlyRent] = useState<number>(0);
  const [totalDue, setTotalDue] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAllProperties();
        setProperties(data);
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleSelectProperty = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    const property = properties.find(p => p.id === propertyId);
    if (property?.type === "building" && property.units) {
      setUnits(property.units);
    } else {
      setUnits([]);
      setSelectedUnitId(null);
    }
  };

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    const unit = units.find(u => u.id === unitId);
    if (unit) {
      setMonthlyRent(unit.rentAmount);
      calculateTotalDue(unit);
    }
  };

  const calculateTotalDue = (unit: Unit) => {
    const today = new Date();
    if (!unit.startDate) {
      setTotalDue(0);
      return;
    }
    const startDate = new Date(unit.startDate);
    const monthsPassed = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
    const expectedTotal = monthsPassed * unit.rentAmount;
    const paymentsMade = unit.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const due = expectedTotal - paymentsMade;
    setTotalDue(due > 0 ? due : 0);
  };

  const handleSavePayment = async () => {
    if (!selectedPropertyId) {
      Alert.alert("Error", "Please select a property.");
      return;
    }
    if (units.length > 0 && !selectedUnitId) {
      Alert.alert("Error", "Please select a unit.");
      return;
    }
    if (!amountPaid || isNaN(Number(amountPaid))) {
      Alert.alert("Error", "Please enter a valid amount paid.");
      return;
    }
    if (!paymentDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert("Error", "Please enter a valid date in format YYYY-MM-DD.");
      return;
    }

    try {
      await savePaymentToMock({
        id: Date.now().toString(),
        propertyId: selectedPropertyId,
        unitId: selectedUnitId || undefined,
        amount: Number(amountPaid),
        paymentDate: paymentDate,
        notes: notes,
      });

      Alert.alert("Success", "Payment saved successfully!");
      router.back();
    } catch (error) {
      console.error("Failed to save payment:", error);
      Alert.alert("Error", "Failed to save payment. Please try again.");
    }
  };

  const handleDateInput = (text: string) => {
    const cleaned = text.replace(/[^0-9-]/g, '');
    setPaymentDate(cleaned);
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
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Form */}
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

        {units.length > 0 && (
          <>
            <Text style={styles.label}>Unit</Text>
            <View style={styles.dropdown}>
              {units.map((unit) => (
                <TouchableOpacity
                  key={unit.id}
                  style={[
                    styles.dropdownItem,
                    selectedUnitId === unit.id && styles.selectedDropdownItem,
                  ]}
                  onPress={() => handleSelectUnit(unit.id)}
                >
                  <Text>Unit {unit.id}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={styles.label}>Monthly Rent (SAR)</Text>
        <View style={styles.readonlyField}>
          <Text>{monthlyRent ? monthlyRent.toLocaleString() : "-"}</Text>
        </View>

        <Text style={styles.label}>Total Due (SAR)</Text>
        <View style={styles.readonlyField}>
          <Text>{totalDue ? totalDue.toLocaleString() : "-"}</Text>
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
          placeholder="Format: YYYY-MM-DD"
          value={paymentDate}
          onChangeText={handleDateInput}
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
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#17b8a6",
    padding: 15,
    elevation: 4,
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 30,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 50,
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
  readonlyField: {
    backgroundColor: "#e6f7f4",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
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
  selectedDropdownItem: {
    backgroundColor: "#dff8eb",
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
