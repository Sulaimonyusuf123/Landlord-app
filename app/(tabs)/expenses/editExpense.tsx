import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getExpenseById, updateExpense } from "../../../lib/db";
import { Ionicons } from "@expo/vector-icons";
import type { Expense } from "../../../lib/types";

const EditExpense = () => {
  const router = useRouter();
  const { expenseId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [expense, setExpense] = useState<Expense | null>(null);

  const [expenseType, setExpenseType] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const result = await getExpenseById(expenseId as string);
        setExpense(result);
        setExpenseType(result.expenseType || "");
        setAmount(result.amount.toString());
        setExpenseDate(result.expenseDate || "");
        setNotes(result.notes || "");
      } catch (error) {
        Alert.alert("Error", "Expense not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [expenseId]);

  const handleUpdate = async () => {
    if (!expense) return;
    if (!expenseType || !amount || !expenseDate) {
      Alert.alert("Validation", "Please fill all required fields.");
      return;
    }

    try {
      await updateExpense(expense.id, {
        expenseType,
        amount: parseFloat(amount),
        expenseDate,
        notes,
      });
      Alert.alert("Success", "Expense updated successfully.");
      router.replace("/(tabs)/expenses/expenses");
    } catch (error) {
      Alert.alert("Error", "Failed to update expense.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#17b8a6" />
      </View>
    );
  }

  if (!expense) {
    return (
      <View style={styles.centered}>
        <Text>Expense not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/expenses/expenses")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Expense</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Type</Text>
        <TextInput style={styles.input} value={expenseType} onChangeText={setExpenseType} />

        <Text style={styles.label}>Amount</Text>
        <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" />

        <Text style={styles.label}>Date</Text>
        <TextInput style={styles.input} value={expenseDate} onChangeText={setExpenseDate} placeholder="YYYY-MM-DD" />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditExpense;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#17b8a6",
    padding: 15,
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  form: { padding: 20 },
  label: { fontSize: 16, marginBottom: 5, fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#17b8a6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
