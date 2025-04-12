

import React, { useState } from "react";
import { View, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button, Text } from "react-native-paper"; 
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const AddProperty = () => {
  const { control, handleSubmit, reset } = useForm();
  const [image, setImage] = useState(null);
  const router = useRouter();

  const onSubmit = (data) => {
    console.log("Property Data:", { ...data, image });
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
          render={({ field: { onChange, value } }) => (
            <TextInput label="Property Name" value={value} onChangeText={onChange} style={styles.input} />
          )}
        />

        <Controller
          control={control}
          name="propertyType"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextInput label="Property Type" value={value} onChangeText={onChange} style={styles.input} />
          )}
        />

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
          render={({ field: { onChange, value } }) => (
            <TextInput label="Address" value={value} onChangeText={onChange} style={styles.input} />
          )}
        />

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

        {/* Image Picker */}
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? <Image source={{ uri: image }} style={styles.image} /> : <Text>+ Upload Image</Text>}
        </TouchableOpacity>

        {/* Submit Button */}
        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
          Save
        </Button>
      </View>
    </ScrollView>
  );
};

export default AddProperty;

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
    marginBottom: 15,
    backgroundColor: "#dff8eb",
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
});


