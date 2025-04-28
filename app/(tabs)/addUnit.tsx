// app/(tabs)/addUnit.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addUnitToProperty } from '../../lib/mockData';

const AddUnit = () => {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();

  const [size, setSize] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleSave = async () => {
    if (!size || !bedrooms || !bathrooms || !rentAmount || !floorNumber || isNaN(Number(quantity))) {
      Alert.alert('Error', 'Please fill all required fields correctly.');
      return;
    }

    try {
      const numberOfUnits = Math.max(1, parseInt(quantity));

      for (let i = 0; i < numberOfUnits; i++) {
        await addUnitToProperty(propertyId!, {
            id: Date.now().toString() + '-' + i,
            propertyId: propertyId!,
            size: Number(size),
            bedrooms: Number(bedrooms),
            rentAmount: Number(rentAmount),
            status: 'vacant',
            startDate: undefined,
            tenantId: undefined,
            payments: [],
            floorNumber: Number(floorNumber),
            notes: notes.trim() !== '' ? notes : undefined,
          });
          
      }

      Alert.alert('Success', `${numberOfUnits} Unit(s) added successfully!`);
      router.back();
    } catch (error) {
      console.error('Error adding unit:', error);
      Alert.alert('Error', 'Failed to add unit.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Unit</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Size (m²)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={size}
          onChangeText={setSize}
          placeholder="Enter size in square meters"
        />

        <Text style={styles.label}>Bedrooms</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={bedrooms}
          onChangeText={setBedrooms}
          placeholder="Enter number of bedrooms"
        />

        <Text style={styles.label}>Bathrooms</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={bathrooms}
          onChangeText={setBathrooms}
          placeholder="Enter number of bathrooms"
        />

        <Text style={styles.label}>Rent Amount (SAR)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={rentAmount}
          onChangeText={setRentAmount}
          placeholder="Enter rent amount"
        />

        <Text style={styles.label}>Floor Number</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={floorNumber}
          onChangeText={setFloorNumber}
          placeholder="Enter floor number"
        />

        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="Write any notes..."
        />

        <Text style={styles.label}>Number of Identical Units</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
          placeholder="1"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Unit(s)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddUnit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17b8a6',
    padding: 15,
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#17b8a6',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
