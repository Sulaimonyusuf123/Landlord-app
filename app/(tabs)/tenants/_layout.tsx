import { Stack } from 'expo-router';
import React from 'react';

export default function TenantsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="tenants" /> 
      <Stack.Screen name="addTenant" />
      <Stack.Screen name="editTenant" />
      <Stack.Screen name="tenant-details" />
    </Stack>
  );
}