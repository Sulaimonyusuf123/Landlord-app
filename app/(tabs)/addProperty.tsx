// app/(tabs)/addProperty.tsx

import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button, Text, Snackbar } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { savePropertyToMock } from "../../lib/mockData";

const PROPERTY_TYPES = ["Building", "Villa", "Commercial"];

const AddProperty = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  
  const [image, setImage] = useState<string | undefined>(undefined);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const selectedType = watch("propertyType");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const property = {
        id: Date.now().toString(),
        name: data.propertyName,
        type: data.propertyType.toLowerCase(),
        address: data.address || '',
        state: data.state || '',
        city: data.city || '',
        annualRent: data.annualRent ? Number(data.annualRent) : undefined,
        imageUrl: image,
        units: [],
      };
      await savePropertyToMock(property);

      setSnackbarMessage("Property added successfully!");
      setSnackbarVisible(true);
      reset();
      setImage(undefined);

      setTimeout(() => {
        router.replace("/(tabs)/dashboard");
      }, 500);
    } catch (err) {
      Alert.alert("Error", "Failed to save property.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Property</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Property Name */}
        <Controller
          control={control}
          name="propertyName"
          rules={{ required: "Name is required" }}
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

        {/* Property Type */}
        <Controller
          control={control}
          name="propertyType"
          rules={{ required: "Type is required" }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.input}>
              <TouchableOpacity
                onPress={() => setShowOptions(!showOptions)}
                style={{
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: errors.propertyType ? "red" : "#ccc",
                  borderRadius: 5,
                  padding: 15,
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: value ? "#000" : "#aaa" }}>
                  {value || "Select Property Type"}
                </Text>
              </TouchableOpacity>
              {showOptions && (
                <View style={{
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  marginTop: 5,
                  overflow: "hidden",
                }}>
                  {PROPERTY_TYPES.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => {
                        onChange(option);
                        setShowOptions(false);
                      }}
                      style={{ padding: 15 }}
                    >
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.propertyType?.message && (
                <Text style={{ color: 'red', marginTop: 4 }}>
                  {errors.propertyType.message.toString()}
                </Text>
              )}
            </View>
          )}
        />

        {/* Address */}
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

        {/* State */}
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

        {/* City */}
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

        {/* Additional Fields */}
        {selectedType === "Villa" && (
          <>
            <Controller
              control={control}
              name="annualRent"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Annual Rent (SAR)"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
            />
            <Controller
              control={control}
              name="floors"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Number of Floors"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
            />
            <Controller
              control={control}
              name="bedrooms"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Bedrooms"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
            />
            <Controller
              control={control}
              name="bathrooms"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Bathrooms"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
            />
          </>
        )}

        {selectedType === "Commercial" && (
          <Controller
            control={control}
            name="annualRent"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Annual Rent (SAR)"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />
        )}

        {/* Image Picker */}
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Ionicons name="cloud-upload-outline" size={24} color="#17b8a6" />
              <Text style={{ color: "#17b8a6" }}>Upload Property Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          contentStyle={{ paddingVertical: 5 }}
        >
          Save Property
        </Button>

        {/* Snackbar */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          {snackbarMessage}
        </Snackbar>
      </ScrollView>
    </View>
  );
};

export default AddProperty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#17b8a6",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
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
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#dff8eb",
    borderStyle: "dashed",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
    minHeight: 150,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#17b8a6",
  },
});
