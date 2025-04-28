import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button, Text, ActivityIndicator, Snackbar } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUnitById, updateUnitOfProperty } from "../../lib/mockData";

interface UnitFormData {
    size: string;
    bedrooms: string;
    bathrooms: string;
    rentAmount: string;
    floorNumber?: string;
    notes?: string;
}

const EditUnit = () => {
    const router = useRouter();
    const { propertyId, unitId } = useLocalSearchParams<{ propertyId: string, unitId: string }>();

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<UnitFormData>();
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        const loadUnit = async () => {
            try {
                const unit = await getUnitById(propertyId!, unitId!);
                if (unit) {
                    setValue("size", unit.size.toString());
                    setValue("bedrooms", unit.bedrooms.toString());
                    setValue("bathrooms", unit.bathrooms.toString());
                    setValue("rentAmount", unit.rentAmount.toString());
                    setValue("floorNumber", unit.floorNumber?.toString() || "");
                    setValue("notes", unit.notes || "");
                }
            } catch (error) {
                console.error("Error loading unit:", error);
            }
        };
        if (propertyId && unitId) loadUnit();
    }, [propertyId, unitId]);

    const onSubmit = async (data: UnitFormData) => {
        try {
            setLoading(true);
            await updateUnitOfProperty(propertyId!, unitId!, {
                size: parseFloat(data.size),
                bedrooms: parseInt(data.bedrooms),
                bathrooms: parseInt(data.bathrooms),
                rentAmount: parseFloat(data.rentAmount),
                floorNumber: data.floorNumber ? parseInt(data.floorNumber) : undefined,
                notes: data.notes || undefined,
            });

            setSnackbarMessage("Unit updated successfully!");
            setSnackbarVisible(true);

            setTimeout(() => {
                router.replace("/(tabs)/properties");
            }, 1000);

        } catch (error) {
            console.error("Failed to update unit:", error);
            Alert.alert("Error", "Failed to update unit. Please try again.");
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
                    <Text style={styles.headerText}>Edit Unit</Text>
                    <View style={{ width: 24 }} />
                </View>

                <Controller
                    control={control}
                    name="size"
                    rules={{ required: "Size is required" }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput label="Size (m²)" value={value} onChangeText={onChange} style={styles.input} error={!!errors.size} keyboardType="numeric" />
                    )}
                />
                {errors.size && <Text style={styles.errorText}>{errors.size.message}</Text>}

                <Controller
                    control={control}
                    name="bedrooms"
                    rules={{ required: "Bedrooms are required" }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput label="Bedrooms" value={value} onChangeText={onChange} style={styles.input} error={!!errors.bedrooms} keyboardType="numeric" />
                    )}
                />
                {errors.bedrooms && <Text style={styles.errorText}>{errors.bedrooms.message}</Text>}

                <Controller
                    control={control}
                    name="bathrooms"
                    rules={{ required: "Bathrooms are required" }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput label="Bathrooms" value={value} onChangeText={onChange} style={styles.input} error={!!errors.bathrooms} keyboardType="numeric" />
                    )}
                />
                {errors.bathrooms && <Text style={styles.errorText}>{errors.bathrooms.message}</Text>}

                <Controller
                    control={control}
                    name="rentAmount"
                    rules={{ required: "Rent Amount is required" }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput label="Rent Amount (SAR)" value={value} onChangeText={onChange} style={styles.input} error={!!errors.rentAmount} keyboardType="numeric" />
                    )}
                />
                {errors.rentAmount && <Text style={styles.errorText}>{errors.rentAmount.message}</Text>}

                <Controller
                    control={control}
                    name="floorNumber"
                    render={({ field: { onChange, value } }) => (
                        <TextInput label="Floor Number" value={value} onChangeText={onChange} style={styles.input} keyboardType="numeric" />
                    )}
                />

                <Controller
                    control={control}
                    name="notes"
                    render={({ field: { onChange, value } }) => (
                        <TextInput label="Notes" value={value} onChangeText={onChange} style={styles.input} multiline numberOfLines={3} />
                    )}
                />

                <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button} disabled={loading}>
                    {loading ? <ActivityIndicator animating={true} color="white" /> : "Update"}
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

export default EditUnit;

const styles = StyleSheet.create({
    scrollContainer: { paddingBottom: 20 },
    container: { padding: 20, backgroundColor: "#fff", flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#009688',
        paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, marginBottom: 20, justifyContent: 'space-between'
    },
    headerText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    input: { marginBottom: 5, backgroundColor: "#dff8eb" },
    errorText: { color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 5 },
    button: { marginTop: 10, backgroundColor: '#009688' },
    snackbar: { backgroundColor: '#4CAF50', position: 'absolute', bottom: 10, left: 20, right: 20 },
});
