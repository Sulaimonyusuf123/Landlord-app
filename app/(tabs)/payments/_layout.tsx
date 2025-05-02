import { Stack } from 'expo-router';
import React from 'react';

export default function PaymentsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="payments" />
      <Stack.Screen name="addPayment" />
      <Stack.Screen name="paymentReport" />
    </Stack>
  );
}