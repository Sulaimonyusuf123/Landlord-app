import { Stack } from 'expo-router';
import React from 'react';

export default function UnitsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="units" /> 
      <Stack.Screen name="addUnit" />
      <Stack.Screen name="editUnit" />
      <Stack.Screen name="unit-details" />
    </Stack>
  );
}