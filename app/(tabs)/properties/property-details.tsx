import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPropertyById, getUnitsOfProperty, deletePropertyFromMock } from '../../../lib/mockData';
import type { Property, Unit } from '../../../lib/mockData';

const PropertyDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const propertyId = params.propertyId as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [propertyId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const prop = await getPropertyById(propertyId);
      setProperty(prop || null);

      if (prop?.type === 'building') {
        const unitList = await getUnitsOfProperty(propertyId);
        setUnits(unitList);
      }
    } catch (error) {
      console.error('Failed to load property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = () => {
    Alert.alert(
      "Delete Property",
      "Are you sure you want to delete this property?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deletePropertyFromMock(propertyId);
            router.replace("/(tabs)/properties/properties");
          },
        },
      ]
    );
  };

  const handleEditProperty = () => {
    router.push({ pathname: '/(tabs)/properties/editProperty', params: { propertyId } });
  };

  const handleAddUnit = () => {
    router.push({ pathname: '/(tabs)/units/addUnit', params: { propertyId } });
  };

  const handleViewUnit = (unitId: string) => {
    router.push({ pathname: '/(tabs)/units/unit-details', params: { propertyId, unitId } });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#17b8a6" />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.container}>
        <Text>Property not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{property.name}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleEditProperty} style={styles.iconButton}>
            <Ionicons name="create-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteProperty} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Property Info */}
      <View style={styles.details}>
        <Text style={styles.sectionTitle}>Property Information</Text>
        <Text style={styles.detailText}>Type: {property.type}</Text>
        <Text style={styles.detailText}>Address: {property.address || '-'}</Text>
        <Text style={styles.detailText}>State: {property.state || '-'}</Text>
        <Text style={styles.detailText}>City: {property.city || '-'}</Text>
      </View>

      {/* Units List */}
      {property.type === 'building' && (
        <>
          <View style={styles.unitsHeader}>
            <Text style={styles.sectionTitle}>Units</Text>
            <TouchableOpacity onPress={handleAddUnit} style={styles.addUnitButton}>
              <Text style={styles.addUnitButtonText}>+ Add Unit</Text>
            </TouchableOpacity>
          </View>

          {units.length === 0 ? (
            <Text style={styles.noDataText}>No units added yet.</Text>
          ) : (
            units.map((unit) => (
              <TouchableOpacity
                key={unit.id}
                style={styles.unitCard}
                onPress={() => handleViewUnit(unit.id)}
              >
                <Text style={styles.unitName}>Unit {unit.id}</Text>
                <Text style={styles.unitInfo}>Size: {unit.size} m²</Text>
                <Text style={styles.unitInfo}>Bedrooms: {unit.bedrooms}</Text>
                <Text style={styles.unitInfo}>Rent: {unit.rentAmount} SAR</Text>
                <Text style={styles.unitInfo}>Status: {unit.status}</Text>
              </TouchableOpacity>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
};

export default PropertyDetails;

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
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
  },
  details: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  unitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  addUnitButton: {
    backgroundColor: '#17b8a6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addUnitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
  unitCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unitName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  unitInfo: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
