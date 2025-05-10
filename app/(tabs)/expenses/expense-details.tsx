// app/(tabs)/expenses/expenseDetails.tsx

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getExpenseById } from "../../../lib/db";
import type { Expense } from "../../../lib/types";

const ExpenseDetails = () => {
  const router = useRouter();
  const { expenseId } = useLocalSearchParams<{ expenseId: string }>();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const result = await getExpenseById(expenseId!);
        setExpense(result);
      } catch (error) {
        Alert.alert("Error", "Failed to load expense details.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [expenseId]);

  const handleEdit = () => {
    if (!expense) return;
    router.push({
      pathname: "/(tabs)/expenses/editExpense",
      params: { expenseId: expense.id },
    });
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
        <Text style={styles.headerTitle}>Expense Details</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{expense.expenseType}</Text>

        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>{expense.amount} SAR</Text>

        <Text style={styles.label}>Property ID:</Text>
        <Text style={styles.value}>{expense.propertyId}</Text>

        {expense.unitId && (
          <>
            <Text style={styles.label}>Unit ID:</Text>
            <Text style={styles.value}>{expense.unitId}</Text>
          </>
        )}

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{expense.expenseDate}</Text>

        {expense.notes && (
          <>
            <Text style={styles.label}>Notes:</Text>
            <Text style={styles.value}>{expense.notes}</Text>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.editButtonText}>Edit Expense</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExpenseDetails;

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
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, color: "#444" },
  editButton: {
    backgroundColor: "#17b8a6",
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
