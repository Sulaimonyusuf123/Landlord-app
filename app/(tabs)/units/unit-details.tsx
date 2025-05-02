// app/(tabs)/unit-details.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUnitById, getTenantById, removeTenantFromUnit } from '../../../lib/mockData';
import type { Unit, Tenant } from '../../../lib/mockData';

const UnitDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const propertyId = params.propertyId as string;
  const unitId = params.unitId as string;

  const [unit, setUnit] = useState<Unit | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUnitAndTenant = async () => {
      try {
        const unitData = await getUnitById(propertyId, unitId);
        setUnit(unitData || null);

        if (unitData?.tenantId) {
          const tenantData = await getTenantById(unitData.tenantId);
          setTenant(tenantData || null);
        }
      } catch (error) {
        console.error('Error loading unit or tenant:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUnitAndTenant();
  }, [propertyId, unitId]);

  const handleAddTenant = () => {
    router.push({ pathname: '/(tabs)/tenants/addTenant', params: { propertyId, unitId } });

  };

  const handleEditTenant = () => {
    if (tenant) {
      router.push({ pathname: '/(tabs)/tenants/editTenant', params: { tenantId: tenant.id } });
    }
  };

  const handleRemoveTenant = async () => {
    try {
      await removeTenantFromUnit(propertyId, unitId);
      Alert.alert("Success", "Tenant removed successfully!");
      setTenant(null);
      setUnit(prev => prev ? { ...prev, status: 'vacant', tenantId: undefined, startDate: undefined } : prev);
    } catch (error) {
      console.error('Failed to remove tenant:', error);
      Alert.alert("Error", "Failed to remove tenant.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#17b8a6" />
      </View>
    );
  }

  if (!unit) {
    return (
      <View style={styles.container}>
        <Text>Unit not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Unit Details</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Unit #{unit.id}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Size:</Text>
          <Text style={styles.value}>{unit.size} m²</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Bedrooms:</Text>
          <Text style={styles.value}>{unit.bedrooms}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Bathrooms:</Text>
          <Text style={styles.value}>{unit.bathrooms}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Rent:</Text>
          <Text style={styles.value}>{unit.rentAmount} SAR</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, unit.status === 'occupied' ? styles.occupied : styles.vacant]}>
            {unit.status}
          </Text>
        </View>

        {tenant ? (
          <>
            <View style={styles.tenantSection}>
              <Text style={styles.sectionTitle}>Tenant Info</Text>
              <Text>Name: {tenant.name}</Text>
              <Text>Phone: {tenant.phone}</Text>
              <Text>Email: {tenant.email}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleEditTenant}>
              <Text style={styles.buttonText}>Edit Tenant</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleRemoveTenant}>
              <Text style={styles.buttonText}>Remove Tenant</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleAddTenant}>
            <Text style={styles.buttonText}>Add Tenant</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17b8a6',
    padding: 15,
  },
  headerText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: { fontSize: 16, color: '#666' },
  value: { fontSize: 16, fontWeight: '500' },
  occupied: { color: 'green' },
  vacant: { color: 'orange' },
  button: {
    backgroundColor: '#17b8a6',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  tenantSection: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: { fontWeight: 'bold', marginBottom: 10, fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default UnitDetails;