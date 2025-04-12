import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const BillPaymentScreen = () => {
  const router = useRouter();
  const [billAmount, setBillAmount] = useState('');
  const [tenantAccountNumber, setTenantAccountNumber] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);

  const goBack = () => {
    router.back();
  };

  const handlePayment = () => {
    if (!billAmount || !tenantAccountNumber || !paymentMethod) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const today = new Date();
    const receiptNumber = `RNT-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}${Math.floor(Math.random() * 1000)}`;
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0];
    const transactionId = `TXN-${Math.floor(Math.random() * 10000000000)}`;

    const paymentDetails = {
      amount: billAmount,
      tenantAccount: tenantAccountNumber,
      method: paymentMethod,
      date: today.toLocaleDateString(),
    };

    setPaymentHistory((prevHistory) => [...prevHistory, paymentDetails]);

    const paymentData = {
      receiptNumber,
      date,
      time,
      tenantName: tenantName || 'Tenant',
      tenantAccountNumber,
      propertyAddress: propertyAddress || 'Property Address Not Provided',
      amount: billAmount,
      paymentMethod,
      cardNumber: paymentMethod.toLowerCase().includes('card') ? '****-****-****-' + Math.floor(1000 + Math.random() * 9000) : '',
      description: 'Monthly Rent Payment',
      additionalFees: [{ name: 'Processing Fee', amount: '2.50' }],
      status: 'Completed',
      transactionId,
    };

    console.log('Sending paymentData:', paymentData); // Debug log
    router.push({
      pathname: 'reciept', // Matches Stack.Screen name in _layout.js
      params: { paymentData: JSON.stringify(paymentData) },
    });

    setBillAmount('');
    setTenantAccountNumber('');
    setTenantName('');
    setPropertyAddress('');
    setPaymentMethod('');
  };

  const sendReminder = () => {
    if (!tenantAccountNumber) {
      Alert.alert('Error', 'Enter tenant account number to send reminder');
      return;
    }
    Alert.alert('Reminder Sent', `Payment reminder sent to tenant ${tenantAccountNumber}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Landlord Rent Payment</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Rent Amount ($) <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={billAmount}
            onChangeText={setBillAmount}
            keyboardType="numeric"
            placeholder="Enter rent amount"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tenant Account Number <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={tenantAccountNumber}
            onChangeText={setTenantAccountNumber}
            keyboardType="numeric"
            placeholder="Enter tenant account number"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tenant Name</Text>
          <TextInput
            style={styles.input}
            value={tenantName}
            onChangeText={setTenantName}
            placeholder="Enter tenant name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Property Address</Text>
          <TextInput
            style={styles.input}
            value={propertyAddress}
            onChangeText={setPropertyAddress}
            placeholder="Enter property address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Payment Method <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={paymentMethod}
            onChangeText={setPaymentMethod}
            placeholder="e.g., Credit Card, PayPal"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reminderButton} onPress={sendReminder}>
          <Text style={styles.buttonText}>Send Payment Reminder</Text>
        </TouchableOpacity>

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Payment History</Text>
          {paymentHistory.length > 0 ? (
            paymentHistory.map((payment, index) => (
              <Text key={index} style={styles.historyItem}>
                {`${payment.date}: $${payment.amount} - Tenant ${payment.tenantAccount} via ${payment.method}`}
              </Text>
            ))
          ) : (
            <Text style={styles.historyItem}>No payments recorded yet.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#17b8a6',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: { marginRight: 15, padding: 5 },
  headerTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', flex: 1 },
  contentContainer: { padding: 20 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5, color: '#666' },
  required: { color: 'red' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#17b8a6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  reminderButton: {
    backgroundColor: '#17b8a6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  historyContainer: { marginTop: 30 },
  historyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  historyItem: { fontSize: 14, color: '#666', marginBottom: 5 },
});

export default BillPaymentScreen;