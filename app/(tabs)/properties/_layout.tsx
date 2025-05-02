import { Stack } from 'expo-router';
import React from 'react';

export default function PropertiesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="properties" /> 
      <Stack.Screen name="addProperty" />
      <Stack.Screen name="editProperty" />
      <Stack.Screen name="property-details" />
    </Stack>
  );
}