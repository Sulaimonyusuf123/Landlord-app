// app/(tabs)/editProperty.tsx

import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPropertyById, updatePropertyInMock } from '../../lib/mockData';

interface PropertyFormData {
  name: string;
  address?: string;
  state?: string;
  city?: string;
  type: 'building' | 'villa' | 'commercial';
}

const EditProperty = () => {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<PropertyFormData>();
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const property = await getPropertyById(propertyId!);
        if (property) {
          setValue('name', property.name);
          setValue('address', property.address || '');
          setValue('state', property.state || '');
          setValue('city', property.city || '');
          setValue('type', property.type);
        }
      } catch (error) {
        console.error('Error loading property:', error);
      }
    };
    if (propertyId) loadProperty();
  }, [propertyId]);

  const onSubmit = async (data: PropertyFormData) => {
    try {
      setLoading(true);

      await updatePropertyInMock(propertyId!, {
        ...data,
      });

      setSnackbarMessage('Property updated successfully!');
      setSnackbarVisible(true);

      setTimeout(() => {
        router.replace('/(tabs)/properties');
      }, 1000);

    } catch (error) {
      console.error('Failed to update property:', error);
      Alert.alert('Error', 'Failed to update property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Property</Text>
          <View style={{ width: 24 }} />
        </View>

        <Controller
          control={control}
          name="name"
          rules={{ required: 'Name is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Name"
              value={value}
              onChangeText={onChange}
              style={styles.input}
              error={!!errors.name}
            />
          )}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Address"
              value={value}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="state"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="State"
              value={value}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="City"
              value={value}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="type"
          rules={{ required: 'Type is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Type (building, villa, commercial)"
              value={value}
              onChangeText={onChange}
              style={styles.input}
              error={!!errors.type}
            />
          )}
        />
        {errors.type && <Text style={styles.errorText}>{errors.type.message}</Text>}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator animating={true} color="white" />
          ) : (
            "Update"
          )}
        </Button>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={styles.snackbar}
          action={{
            label: 'OK',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </ScrollView>
  );
};

export default EditProperty;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#009688',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 5,
    backgroundColor: "#dff8eb",
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#009688',
  },
  snackbar: {
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
  },
});
