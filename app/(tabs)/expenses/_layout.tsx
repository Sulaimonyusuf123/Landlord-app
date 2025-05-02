import { Stack } from 'expo-router';
import React from 'react';

export default function ExpensesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="expenses" /> 
      <Stack.Screen name="addExpense" />
    </Stack>
  );
}