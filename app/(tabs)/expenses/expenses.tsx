import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllExpenses } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/authService";
import type { Expense } from "../../../lib/types";

const Expenses = () => {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          console.warn("No user found");
          return;
        }
        const data = await getAllExpenses(user.$id);
        setExpenses(data);
      } catch (error) {
        console.error("Failed to load expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleAddExpense = () => {
    router.push("/(tabs)/expenses/addExpense");
  };

  const handleEditExpense = (expenseId: string) => {
    router.push({ pathname: "/(tabs)/expenses/editExpense", params: { expenseId } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/dashboard")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expenses</Text>
        <TouchableOpacity onPress={handleAddExpense}>
          <Ionicons name="add-circle-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#17b8a6" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {expenses.length === 0 ? (
            <Text style={styles.noDataText}>No expenses recorded yet.</Text>
          ) : (
            expenses.map((expense) => (
              <View key={expense.id} style={styles.expenseCard}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/expenses/expense-details",
                      params: { expenseId: expense.id },
                    })
                  }
                >
                  <Text style={styles.expenseType}>{expense.expenseType}</Text>
                  <Text style={styles.amount}>{expense.amount.toLocaleString()} SAR</Text>
                  <Text style={styles.details}>
                    Property ID: {expense.propertyId} {expense.unitId ? `| Unit: ${expense.unitId}` : ""}
                  </Text>
                  <Text style={styles.details}>Date: {expense.expenseDate}</Text>
                  {expense.notes && <Text style={styles.details}>Notes: {expense.notes}</Text>}
                </TouchableOpacity>
                <View style={styles.editButtonRow}>
                  <TouchableOpacity onPress={() => handleEditExpense(expense.id)}>
                    <Ionicons name="create-outline" size={20} color="#FFA500" />
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

export default Expenses;

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
  expenseCard: {
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
  expenseType: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  amount: {
    fontSize: 15,
    color: "#17b8a6",
    marginBottom: 5,
  },
  details: {
    fontSize: 13,
    color: "#666",
    marginBottom: 3,
  },
  editButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
});
