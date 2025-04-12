import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Already imported, used for back button
import { useRouter } from 'expo-router'; // Import for navigation

const transactions = [
  { id: '1', type: 'Bank Transfer', amount: '+ $5000', date: '2025/02/10', attachment: true },
  { id: '2', type: 'Bank Transfer', amount: '+ $5000', date: '2025/02/10', attachment: true },
  { id: '3', type: 'Bank Transfer', amount: '+ $5000', date: '2025/02/10', attachment: true },
  { id: '4', type: 'Bank Transfer', amount: '+ $5000', date: '2025/02/10', attachment: false },
  { id: '5', type: 'Bank Transfer', amount: '+ $5000', date: '2025/02/10', attachment: false },
];

const TransactionCard = ({ type, amount, date, attachment }) => (
  <View style={styles.card}>
    <View style={styles.iconContainer}>
      <Image source={require('../../assets/images/one.png')} style={styles.icon} />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.type}>{type}</Text>
      <View style={styles.attachmentRow}>
        {attachment && (
          <>
            <Image source={require('../../assets/images/two.png')} style={styles.attachmentIcon} />
            <Text style={styles.attachmentText}>1 Attachment</Text>
          </>
        )}
        {attachment && <Text style={styles.debitText}>debit</Text>}
      </View>
    </View>
    <View style={styles.amountContainer}>
      <Text style={styles.amount}>{amount}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  </View>
);

const TransactionHistory = () => {
  const router = useRouter(); // Hook for navigation

  const goBack = () => {
    router.back(); // Navigate back to the previous screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Transaction History</Text>
      </View>
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <TransactionCard
            type={item.type}
            amount={item.amount}
            date={item.date}
            attachment={item.attachment}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#17b8a6', // Matching PaymentReceiptScreen color
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff', // White text to match PaymentReceiptScreen
    flex: 1, // Takes up remaining space
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 15,
  },
  icon: {
    width: 40,
    height: 40,
  },
  textContainer: {
    flex: 1,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  attachmentIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  attachmentText: {
    fontSize: 12,
    color: '#888',
    marginRight: 10,
  },
  debitText: {
    fontSize: 12,
    color: '#888',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00C853', // Green color for positive amount
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
});

export default TransactionHistory;