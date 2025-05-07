import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { TextInput, Button, Text, ActivityIndicator, Snackbar } from "react-native-paper"; 
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getTenantById, updateTenantInMock, saveTenantToMock } from "../../../lib/mockData";

interface TenantFormData {
  name: string;
  email: string;
  phone: string;
  state?: string;
  city?: string;
}

const EditTenant = () => {
  const router = useRouter();
  const { tenantId, propertyId, unitId } = useLocalSearchParams<{
    tenantId: string;
    propertyId?: string;
    unitId?: string;
  }>();

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<TenantFormData>();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const loadTenant = async () => {
      try {
        const tenant = await getTenantById(tenantId!);
        if (tenant) {
          setValue("name", tenant.name);
          setValue("email", tenant.email);
          setValue("phone", tenant.phone);
          setValue("state", tenant.state || '');
          setValue("city", tenant.city || '');
          setImage(tenant.imageUrl || null);
        }
      } catch (error) {
        console.error("Error loading tenant:", error);
      }
    };
    if (tenantId) loadTenant();
  }, [tenantId]);

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

  const onSubmit = async (data: TenantFormData) => {
    try {
      setLoading(true);

      const tenant = {
        id: tenantId!,
        name: data.name,
        email: data.email,
        phone: data.phone,
        state: data.state || '',
        city: data.city || '',
        imageUrl: image || undefined,
      };

      await updateTenantInMock(tenantId!, tenant);

      if (propertyId && unitId) {
        await saveTenantToMock(propertyId, unitId, tenant);
      }

      setSnackbarMessage("Tenant updated successfully!");
      setSnackbarVisible(true);

      setTimeout(() => {
        router.replace("/(tabs)/properties/properties");
      }, 1000);

    } catch (error) {
      console.error("Failed to update tenant:", error);
      Alert.alert("Error", "Failed to update tenant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Tenant</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Form Fields */}
        <Controller control={control} name="name" rules={{ required: "Name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput label="Name" value={value} onChangeText={onChange} style={styles.input} error={!!errors.name} />
          )} />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

        <Controller control={control} name="email" rules={{ required: "Email is required", pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i, message: "Invalid email address"
        }}}
          render={({ field: { onChange, value } }) => (
            <TextInput label="Email" value={value} onChangeText={onChange} style={styles.input} error={!!errors.email} />
          )} />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <Controller control={control} name="phone" rules={{ required: "Phone number is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput label="Phone" value={value} onChangeText={onChange} keyboardType="phone-pad" style={styles.input} error={!!errors.phone} />
          )} />
        {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

        <Controller control={control} name="state"
          render={({ field: { onChange, value } }) => (
            <TextInput label="State" value={value} onChangeText={onChange} style={styles.input} />
          )} />
        <Controller control={control} name="city"
          render={({ field: { onChange, value } }) => (
            <TextInput label="City" value={value} onChangeText={onChange} style={styles.input} />
          )} />

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? <Image source={{ uri: image }} style={styles.image} /> : <Text>+ Upload Image</Text>}
        </TouchableOpacity>

        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button} disabled={loading}>
          {loading ? <ActivityIndicator animating color="white" /> : "Update"}
        </Button>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={styles.snackbar}
          action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </ScrollView>
  );
};

export default EditTenant;

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 20 },
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
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
  headerText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  input: { marginBottom: 5, backgroundColor: "#dff8eb" },
  errorText: { color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 5 },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#dff8eb",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: { width: 100, height: 100, borderRadius: 5 },
  button: { marginTop: 10, backgroundColor: '#009688' },
  snackbar: {
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
  },
});
