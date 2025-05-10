// app/(tabs)/payments/paymentReport.tsx

import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Text, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAllPayments, getTenantById, getPropertyById } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/authService";

type PaymentInfo = {
  id: string;
  tenantName: string;
  propertyName: string;
  amount: number;
  date: string;
  type: string;
};

const PaymentReport = () => {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;

        const rawPayments = await getAllPayments(user.$id);

        const detailed = await Promise.all(
          rawPayments.map(async (payment) => {
            const tenant = payment.tenantId ? await getTenantById(payment.tenantId, user.$id) : null;
            const property = await getPropertyById(payment.propertyId, user.$id);
            return {
              id: payment.id,
              tenantName: tenant?.name || "Unknown Tenant",
              propertyName: property?.name || "Unknown Property",
              amount: payment.amount,
              date: payment.paymentDate,
              type: payment.notes || "General",
            };
          })
        );


        setPayments(detailed);
      } catch (err) {
        console.error("Failed to load payments", err);
        Alert.alert("Error", "Failed to load payment report.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/dashboard")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Payment Report</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {payments.map((payment) => (
          <Card key={payment.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.tenantName}>{payment.tenantName}</Text>
              <Text style={styles.details}>🏠 {payment.propertyName}</Text>
              <Text style={styles.details}>📋 {payment.type}</Text>
              <View style={styles.footer}>
                <Text style={styles.amount}>+{payment.amount.toLocaleString()} SAR</Text>
                <Text style={styles.date}>{payment.date}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
        {payments.length === 0 && !loading && (
          <Text style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
            No payments found.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default PaymentReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F3EE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#009688",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
});
