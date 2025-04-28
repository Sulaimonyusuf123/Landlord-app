import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="properties" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="expenses" />
      <Stack.Screen name="tenants" />
      <Stack.Screen name="paymentReport" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="addProperty" />
      <Stack.Screen name="addTenant" />
      <Stack.Screen name="addPayment" />
      <Stack.Screen name="addExpense" />
      <Stack.Screen name="units" />
      <Stack.Screen name="unit-details" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="navbar" />
    </Stack>
  );
}
