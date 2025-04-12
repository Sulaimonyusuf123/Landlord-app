import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from 'expo-router';

const Properties = () => {
  const router = useRouter();
  // State to track which property's menu is open
  const [activeMenu, setActiveMenu] = useState(null);

  // Define your image assets
  const images = {
    building: require("../../assets/images/build.png"),
  };

  // Sample property data (you can replace with your actual data)
  const [propertyData, setPropertyData] = useState([
    { id: 1, title: '3 Bedroom Flat', type: 'Rent', category: 'Residential' },
    { id: 2, title: '4 Bedroom Flat', type: 'Rent', category: 'Residential' },
    { id: 3, title: '2 Bedroom Flat', type: 'Rent', category: 'Residential' },
    { id: 4, title: '3 Bedroom Flat', type: 'Rent', category: 'Residential' },
  ]);

  // Toggle menu for a specific property
  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  // Go back function
  const goBack = () => {
    router.back();
  };

  // Handle update action
  const handleUpdate = (property) => {
    // Close the menu
    setActiveMenu(null);
    
    // Implement your update logic here
    Alert.alert(
      "Update Property",
      `Update ${property.title}`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "OK", 
          onPress: () => {
            // For example, update the property title
            const updatedProperties = propertyData.map(p => 
              p.id === property.id ? {...p, title: p.title + " (Updated)"} : p
            );
            setPropertyData(updatedProperties);
            console.log("Property updated:", property.id);
          }
        }
      ]
    );
  };

  // Handle delete action
  const handleDelete = (property) => {
    // Close the menu
    setActiveMenu(null);
    
    // Show confirmation dialog
    Alert.alert(
      "Delete Property",
      `Are you sure you want to delete ${property.title}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            // Actually delete the property from the array
            const filteredProperties = propertyData.filter(p => p.id !== property.id);
            setPropertyData(filteredProperties);
            console.log("Property deleted:", property.id);
          }
        }
      ]
    );
  };

  // Render item for FlatList
  const renderProperty = ({ item }) => (
    <View style={styles.propertyContainer}>
      <TouchableOpacity style={styles.propertyCard}>
        <Image 
          source={images.building} 
          style={styles.propertyImage} 
          contentFit="contain" 
        />
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle}>{item.title}</Text>
          <Text style={styles.propertyDetails}>
            🏡 {item.type} • 🔴 {item.category}
          </Text>
        </View>
        <TouchableOpacity onPress={() => toggleMenu(item.id)}>
          <Ionicons name="ellipsis-vertical" size={20} color="black" />
        </TouchableOpacity>
      </TouchableOpacity>
      
      {/* Compact action menu */}
      {activeMenu === item.id && (
        <View style={styles.actionMenu}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleUpdate(item)}
          >
            <Ionicons name="create-outline" size={16} color="#17b8a6" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash-outline" size={16} color="#ff4d4f" />
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Properties</Text>
      </View>

      {/* Properties list */}
      <FlatList
        data={propertyData}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Property List</Text>
        }
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
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginTop: 15,
    marginBottom: 10,
  },
  propertyContainer: {
    position: 'relative',
    marginVertical: 5,
  },
  propertyCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#FFFFFF", 
    padding: 15, 
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  propertyImage: { 
    width: 40, 
    height: 40, 
    marginRight: 10,
  },
  propertyInfo: { 
    flex: 1,
  },
  propertyTitle: { 
    fontSize: 16, 
    fontWeight: "600",
    color: '#333',
  },
  propertyDetails: { 
    fontSize: 14, 
    color: "gray",
  },
  actionMenu: {
    position: 'absolute',
    top: 10,
    right: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 5,
    width: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 100,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
  },
  deleteText: {
    color: '#ff4d4f',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 2,
  },
});

export default Properties;