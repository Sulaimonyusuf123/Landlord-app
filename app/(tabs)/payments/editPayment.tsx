import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { updatePaymentInMock, getAllPayments } from "../../../lib/mockData";
import type { Payment } from "../../../lib/mockData";

const EditPayment = () => {
  const router = useRouter();
  const { paymentId } = useLocalSearchParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const loadPayment = async () => {
      try {
        const payments = await getAllPayments();
        const existing = payments.find((p) => p.id === paymentId);
        if (existing) {
          setPayment(existing);
          setAmount(existing.amount.toString());
          setDate(existing.paymentDate);
          setNotes(existing.notes || "");
        } else {
          Alert.alert("Error", "Payment not found.");
          router.replace("/(tabs)/payments/payments");
        }
      } catch (error) {
        console.error("Error loading payment:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPayment();
  }, [paymentId]);

  const handleSave = async () => {
    if (!amount || !date) {
      Alert.alert("Validation", "Amount and date are required.");
      return;
    }

    try {
      await updatePaymentInMock(paymentId as string, {
        amount: parseFloat(amount),
        paymentDate: date,
        notes,
      });
      Alert.alert("Updated", "Payment updated successfully.");
      router.replace("/(tabs)/payments/payments");
    } catch (error) {
      console.error("Failed to update payment:", error);
      Alert.alert("Error", "Failed to update payment.");
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/payments/payments")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Payment</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Amount (SAR):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Payment Date:</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
        />

        <Text style={styles.label}>Notes:</Text>
        <TextInput
          style={styles.input}
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditPayment;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#17b8a6",
    padding: 15,
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  form: { padding: 20 },
  label: { fontSize: 14, marginBottom: 5, color: "#444" },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: "#17b8a6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
