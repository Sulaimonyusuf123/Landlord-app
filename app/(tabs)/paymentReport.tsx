import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const payments = [
  { id: 1, tenant: "Tenant 1", amount: "$5000", date: "2025/02/10" },
  { id: 2, tenant: "Tenant 2", amount: "$5000", date: "2025/02/10" },
  { id: 3, tenant: "Tenant 3", amount: "$5000", date: "2025/02/10" },
  { id: 4, tenant: "Tenant 4", amount: "$5000", date: "2025/02/10" },
  { id: 5, tenant: "Tenant 5", amount: "$5000", date: "2025/02/10" },
];

const PaymentReport = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/dashboard")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Payment report</Text>
      </View>
      
      {/* Payment List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {payments.map((payment) => (
          <Card key={payment.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.tenantName}>{payment.tenant}</Text>
              <Text style={styles.details}>📎 1 Attachment</Text>
              <Text style={styles.details}>🏛 debit</Text>
              <View style={styles.footer}>
                <Text style={styles.amount}>+{payment.amount}</Text>
                <Text style={styles.date}>{payment.date}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
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


