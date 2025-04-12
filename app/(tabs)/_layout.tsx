import { Stack } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="navbar" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="addTenant" />
      <Stack.Screen name="addPrperties" />
      <Stack.Screen name="paymentReport" />
      <Stack.Screen name="transaction" />
      
      {/* Add other screens here */}
    </Stack>
  );
}