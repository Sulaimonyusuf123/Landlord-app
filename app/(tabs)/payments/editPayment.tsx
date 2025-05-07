// app/(tabs)/payments/payment-details.tsx

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getPaymentById } from "../../../lib/db";
import type { Payment } from "../../../lib/types";

const PaymentDetails = () => {
  const router = useRouter();
  const { paymentId } = useLocalSearchParams<{ paymentId?: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        if (!paymentId) return;
        const found = await getPaymentById(paymentId);
        setPayment(found);
      } catch (error) {
        console.error("Failed to load payment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [paymentId]);

  const handleEdit = () => {
    if (payment?.id) {
      router.push({ pathname: "/(tabs)/payments/editPayment", params: { paymentId: payment.id } });
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#17b8a6" />
      </View>
    );
  }

  if (!payment) {
    return (
      <View style={styles.centered}>
        <Text>Payment not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/payments/payments")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Details</Text>
        <TouchableOpacity onPress={handleEdit}>
          <Ionicons name="create-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>{payment.amount} SAR</Text>

        <Text style={styles.label}>Property ID:</Text>
        <Text style={styles.value}>{payment.propertyId}</Text>

        {payment.unitId && (
          <>
            <Text style={styles.label}>Unit ID:</Text>
            <Text style={styles.value}>{payment.unitId}</Text>
          </>
        )}

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{payment.paymentDate}</Text>

        {payment.notes && (
          <>
            <Text style={styles.label}>Notes:</Text>
            <Text style={styles.value}>{payment.notes}</Text>
          </>
        )}
      </View>
    </View>
  );
};

export default PaymentDetails;

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
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, color: "#444" },
});
