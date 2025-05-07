// app/(tabs)/payments/payments.tsx

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllPayments, deletePayment } from "../../../lib/db";
import { useAuth } from "../../../lib/authService";
import type { Payment } from "../../../lib/types";

const Payments = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      if (!user) return;
      setLoading(true);
      const data = await getAllPayments(user.$id);
      setPayments(data);
    } catch (error) {
      console.error("Failed to load payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [user]);

  const handleAddPayment = () => {
    router.push("/(tabs)/payments/addPayment");
  };

  const handleEdit = (id: string) => {
    router.push({ pathname: "/(tabs)/payments/editPayment", params: { paymentId: id } });
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Payment", "Are you sure you want to delete this payment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deletePayment(id);
          loadPayments();
        },
      },
    ]);
  };

  const handleView = (id: string) => {
    router.push({ pathname: "/(tabs)/payments/payment-details", params: { paymentId: id } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/dashboard")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments</Text>
        <TouchableOpacity onPress={handleAddPayment}>
          <Ionicons name="add-circle-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#17b8a6" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {payments.length === 0 ? (
            <Text style={styles.noDataText}>No payments recorded yet.</Text>
          ) : (
            payments.map((payment) => (
              <TouchableOpacity
                key={payment.id}
                style={styles.paymentCard}
                activeOpacity={0.85}
                onPress={() => handleView(payment.id)}
              >
                <Text style={styles.amount}>{payment.amount.toLocaleString()} SAR</Text>
                <Text style={styles.details}>
                  Property ID: {payment.propertyId} {payment.unitId ? `| Unit: ${payment.unitId}` : ""}
                </Text>
                <Text style={styles.details}>Date: {payment.paymentDate}</Text>
                {payment.notes && <Text style={styles.details}>Notes: {payment.notes}</Text>}

                <View style={styles.actions}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(payment.id)}>
                    <Ionicons name="create-outline" size={20} color="orange" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(payment.id)}>
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Payments;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
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
  paymentCard: {
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
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#17b8a6",
    marginBottom: 5,
  },
  details: {
    fontSize: 13,
    color: "#666",
    marginBottom: 3,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {},
});
