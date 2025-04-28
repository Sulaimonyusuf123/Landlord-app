// app/(tabs)/payments.tsx

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllPayments } from "../../lib/mockData";
import type { Payment } from "../../lib/mockData";

const Payments = () => {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();
        setPayments(data);
      } catch (error) {
        console.error("Failed to load payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleAddPayment = () => {
    router.push("/(tabs)/addPayment");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
              <View key={payment.id} style={styles.paymentCard}>
                <Text style={styles.amount}>{payment.amount.toLocaleString()} SAR</Text>
                <Text style={styles.details}>
                  Property ID: {payment.propertyId} {payment.unitId ? `| Unit: ${payment.unitId}` : ""}
                </Text>
                <Text style={styles.details}>Date: {payment.paymentDate}</Text>
                {payment.notes && (
                  <Text style={styles.details}>Notes: {payment.notes}</Text>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Payments;

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
    marginBottom: 10,
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
});
