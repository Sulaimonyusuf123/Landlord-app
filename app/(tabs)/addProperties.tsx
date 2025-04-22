import React, { useState } from "react";
import { View, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, Snackbar } from "react-native-paper"; 
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addProperty } from '../../lib/appwrite';

const AddProperty = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log("Submitting property data:", { ...data, image });
      
      // Call the addProperty function from appwrite.js
      const result = await addProperty(data, image);
      
      // Show success message with Snackbar
      setSnackbarMessage("Property added successfully!");
      setSnackbarVisible(true);
      
      // Reset form and image
      reset();
      setImage(null);
      
    } catch (error) {
      console.error("Error adding property:", error);
      setSnackbarMessage(error.message || "Failed to add property. Please try again.");
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/(tabs)/dashboard")} style={{ marginRight: 10 }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Add Property</Text>
        </View>

        {/* Form Inputs */}
        <Controller
          control={control}
          name="propertyName"
          defaultValue=""
          rules={{ required: "Property name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput 
              label="Property Name *" 
              value={value} 
              onChangeText={onChange} 
              style={styles.input}
              error={!!errors.propertyName} 
            />
          )}
        />
        {errors.propertyName && <Text style={styles.errorText}>{errors.propertyName.message}</Text>}

        <Controller
          control={control}
          name="propertyType"
          defaultValue=""
          rules={{ required: "Property type is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput 
              label="Property Type *" 
              value={value} 
              onChangeText={onChange} 
              style={styles.input}
              error={!!errors.propertyType}
            />
          )}
        />
        {errors.propertyType && <Text style={styles.errorText}>{errors.propertyType.message}</Text>}

        <Controller
          control={control}
          name="category"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextInput label="Category" value={value} onChangeText={onChange} style={styles.input} />
          )}
        />

        <Controller
          control={control}
          name="address"
          defaultValue=""
          rules={{ required: "Address is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput 
              label="Address *" 
              value={value} 
              onChangeText={onChange} 
              style={styles.input}
              error={!!errors.address}
            />
          )}
        />
        {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}

        <Controller
          control={control}
          name="state"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextInput label="State" value={value} onChangeText={onChange} style={styles.input} />
          )}
        />

        <Controller
          control={control}
          name="city"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextInput label="City" value={value} onChangeText={onChange} style={styles.input} />
          )}
        />

        <Controller
          control={control}
          name="postCode"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextInput label="Post Code" value={value} onChangeText={onChange} style={styles.input} />
          )}
        />

        <Controller
          control={control}
          name="rentPrice"
          defaultValue=""
          rules={{ 
            required: "Rent price is required",
            pattern: {
              value: /^\d+$/,
              message: "Please enter a valid number"
            }
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput 
              label="Rent Price ($) *" 
              value={value} 
              onChangeText={onChange} 
              style={styles.input}
              keyboardType="numeric"
              error={!!errors.rentPrice}
            />
          )}
        />
        {errors.rentPrice && <Text style={styles.errorText}>{errors.rentPrice.message}</Text>}

        <Controller
          control={control}
          name="bedrooms"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextInput 
              label="Bedrooms" 
              value={value} 
              onChangeText={onChange} 
              style={styles.input}
              keyboardType="numeric"
            />
          )}
        />

        <Controller
          control={control}
          name="bathrooms"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextInput 
              label="Bathrooms" 
              value={value} 
              onChangeText={onChange} 
              style={styles.input}
              keyboardType="numeric"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextInput 
              label="Description" 
              value={value} 
              onChangeText={onChange} 
              style={styles.input}
              multiline
              numberOfLines={3}
            />
          )}
        />

        {/* Image Picker */}
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.uploadContainer}>
              <Ionicons name="cloud-upload-outline" size={24} color="#009688" />
              <Text style={styles.uploadText}>Upload Property Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Submit Button */}
        <Button 
          mode="contained" 
          onPress={handleSubmit(onSubmit)} 
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Property"}
        </Button>

        {/* Success/Error Snackbar */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={[styles.snackbar, { backgroundColor: snackbarMessage.includes("Error") ? '#009688' : '#009688' }]}
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

export default AddProperty;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
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
    marginTop: -3,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#dff8eb",
    borderStyle: 'dashed',
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    minHeight: 150,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  uploadContainer: {
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 10,
    color: '#009688',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#009688',
    paddingVertical: 5,
  },
  snackbar: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 50,
  },
});