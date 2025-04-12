import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const PaymentReceiptScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const receiptRef = useRef();

  const defaultPaymentData = {
    receiptNumber: 'RNT-2025-04092',
    date: '2025-04-09',
    time: '14:32:45',
    tenantName: 'John Doe',
    tenantAccountNumber: '1234567',
    propertyAddress: '123 Main Street, Apt 4B',
    amount: '1200.00',
    paymentMethod: 'Credit Card',
    cardNumber: '****-****-****-4321',
    description: 'Monthly Rent - April 2025',
    additionalFees: [
      { name: 'Late Fee', amount: '0.00' },
      { name: 'Processing Fee', amount: '2.50' },
    ],
    status: 'Completed',
    transactionId: 'TXN-9876543210',
  };

  console.log('Received params.paymentData:', params.paymentData); // Debug log
  const paymentData = (() => {
    try {
      return params.paymentData ? JSON.parse(params.paymentData) : defaultPaymentData;
    } catch (error) {
      console.error('Error parsing paymentData:', error);
      Alert.alert('Error', 'Failed to load receipt data');
      return defaultPaymentData;
    }
  })();

  const goBack = () => {
    router.back();
  };

  const handleShareReceipt = async () => {
    try {
      const shareMessage = `
Payment Receipt
-----------------
Receipt #: ${paymentData.receiptNumber}
Date: ${paymentData.date}
Tenant: ${paymentData.tenantName}
Property: ${paymentData.propertyAddress}
Amount: $${paymentData.amount}
Status: ${paymentData.status}
Transaction ID: ${paymentData.transactionId}
      `;
      await Share.share({
        message: shareMessage,
        title: `Payment Receipt ${paymentData.receiptNumber}`,
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
      Alert.alert('Error', 'Failed to share receipt');
    }
  };

  const captureAndShareReceipt = async () => {
    try {
      // First, capture the receipt view as an image
      const uri = await receiptRef.current.capture();
      
      // Create a unique filename
      const filename = `receipt-${paymentData.receiptNumber}-${Date.now()}.png`;
      
      if (Platform.OS === 'android') {
        // For Android, we need to save to a public directory
        const downloadPath = `${FileSystem.documentDirectory}${filename}`;
        
        // Copy the captured image to the documents directory
        await FileSystem.moveAsync({
          from: uri,
          to: downloadPath
        });
        
        // Check if sharing is available
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadPath, {
            mimeType: 'image/png',
            dialogTitle: 'Share Receipt',
            UTI: 'public.png'
          });
        } else {
          Alert.alert('Success', `Receipt saved to ${downloadPath}`);
        }
      } else {
        // iOS is simpler as we can share directly
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Share Receipt',
            UTI: 'public.png'
          });
        }
      }
    } catch (error) {
      console.error('Error capturing receipt:', error);
      Alert.alert('Error', `Failed to capture receipt: ${error.message}`);
    }
  };

  const calculateTotal = () => {
    const baseAmount = parseFloat(paymentData.amount || 0);
    const feeTotal = paymentData.additionalFees.reduce(
      (sum, fee) => sum + parseFloat(fee.amount || 0),
      0
    );
    return (baseAmount + feeTotal).toFixed(2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Receipt</Text>
        <TouchableOpacity onPress={handleShareReceipt} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <ViewShot
          ref={receiptRef}
          options={{ format: 'png', quality: 0.9 }}
          style={styles.viewShotContainer}
        >
          <View style={styles.receiptCard}>
            <View style={[
              styles.statusBanner,
              paymentData.status === 'Completed' ? styles.statusCompleted : styles.statusPending,
            ]}>
              <Text style={styles.statusText}>{paymentData.status}</Text>
            </View>
            <View style={styles.receiptHeader}>
              <Text style={styles.receiptTitle}>Payment Receipt</Text>
              <Text style={styles.receiptNumber}>#{paymentData.receiptNumber}</Text>
            </View>
            <View style={styles.dateTimeContainer}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{paymentData.date}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{paymentData.time}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Tenant Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{paymentData.tenantName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Account:</Text>
                <Text style={styles.infoValue}>{paymentData.tenantAccountNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Property:</Text>
                <Text style={styles.infoValue}>{paymentData.propertyAddress}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Payment Details</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Description:</Text>
                <Text style={styles.infoValue}>{paymentData.description}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Method:</Text>
                <Text style={styles.infoValue}>{paymentData.paymentMethod}</Text>
              </View>
              {paymentData.cardNumber && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Card:</Text>
                  <Text style={styles.infoValue}>{paymentData.cardNumber}</Text>
                </View>
              )}
            </View>
            <View style={styles.divider} />
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Amount</Text>
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Base Amount:</Text>
                <Text style={styles.amountValue}>${paymentData.amount}</Text>
              </View>
              {paymentData.additionalFees.map((fee, index) => (
                <View key={index} style={styles.amountRow}>
                  <Text style={styles.amountLabel}>{fee.name}:</Text>
                  <Text style={styles.amountValue}>${fee.amount}</Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>${calculateTotal()}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.transactionContainer}>
              <Text style={styles.transactionLabel}>Transaction ID:</Text>
              <Text style={styles.transactionValue}>{paymentData.transactionId}</Text>
            </View>
          </View>
        </ViewShot>
        
        <TouchableOpacity style={styles.downloadButton} onPress={captureAndShareReceipt}>
          <Ionicons name="image-outline" size={18} color="white" />
          <Text style={styles.downloadText}>Save Receipt as Image</Text>
        </TouchableOpacity>
      </ScrollView>
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
  shareButton: { padding: 5 },
  scrollContainer: { flex: 1, padding: 16 },
  viewShotContainer: { backgroundColor: 'white' },
  receiptCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  statusBanner: {
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusCompleted: { backgroundColor: '#d0f0d0' },
  statusPending: { backgroundColor: '#ffeeba' },
  statusText: { fontWeight: 'bold', color: '#333' },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  receiptTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  receiptNumber: { fontSize: 14, color: '#666' },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 15 },
  sectionContainer: { marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
  infoRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'center' },
  infoLabel: { width: 80, fontSize: 14, color: '#666', fontWeight: '500' },
  infoValue: { flex: 1, fontSize: 14, color: '#333' },
  infoText: { fontSize: 14, marginLeft: 5, color: '#666' },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  amountLabel: { fontSize: 14, color: '#666' },
  amountValue: { fontSize: 14, color: '#333' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  transactionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  transactionLabel: { fontSize: 12, color: '#666', marginRight: 5 },
  transactionValue: { fontSize: 12, color: '#333', fontWeight: '500' },
  downloadButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  downloadText: { color: 'white', marginLeft: 8, fontWeight: '600' },
});

export default PaymentReceiptScreen;