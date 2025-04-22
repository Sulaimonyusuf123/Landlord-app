import React, { useState } from "react";
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button, Text, ActivityIndicator, Snackbar } from "react-native-paper"; 
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addTenant } from "../../lib/appwrite"; // Update this path to match your project structure

const AddTenant = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Call the addTenant function from your API
      const result = await addTenant(data, image);
      console.log("Tenant added successfully:", result);
      
      // Show success message with Snackbar
      setSnackbarMessage("Tenant added successfully!");
      setSnackbarVisible(true);
      
      // Reset form and image
      reset();
      setImage(null);
      
    } catch (error) {
      console.error("Failed to add tenant:", error);
      Alert.alert("Error", "Failed to add tenant. Please try again.");
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
          <Text style={styles.headerText}>Add Tenant</Text>
        </View>

        {/* Form Inputs */}
        <Controller
          control={control}
          name="name"
          defaultValue=""
          rules={{ required: "Name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput 
              label="Name" 
              value={value} 
              onChangeText={onChange} 
              style={styles.input}
              error={errors.name}
            />
          )}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

        <Controller
          control={control}
          name="email"
          defaultValue=""
          rules={{ 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput 
              label="Email" 
              value={value} 
              onChangeText={onChange} 
              style={styles.input}
              error={errors.email}
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="phone"
          defaultValue=""
          rules={{ required: "Phone number is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput 
              label="Phone" 
              value={value} 
              onChangeText={onChange} 
              style={styles.input} 
              keyboardType="phone-pad"
              error={errors.phone}
            />
          )}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

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

        {/* Image Picker */}
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? <Image source={{ uri: image }} style={styles.image} /> : <Text>+ Upload Image</Text>}
        </TouchableOpacity>

        {/* Submit Button */}
        <Button 
          mode="contained" 
          onPress={handleSubmit(onSubmit)} 
          style={styles.button}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator animating={true} color="white" />
          ) : (
            "Submit"
          )}
        </Button>
        
        {/* Success Snackbar */}
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

export default AddTenant;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20, // Ensure scrollable space
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
    marginLeft: 5,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#dff8eb",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
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