import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import log from "../assets/images/loghome.png"
export default function Index() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      {/* Image */}
      <Image source={log} style={styles.image} />
      
      {/* Welcome Text */}
      <Text style={styles.title}>Welcome to Landlord</Text>
      <Text style={styles.subtitle}>
        You are now on your way to better property management. Let's get started.
      </Text>
      
      {/* Start Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push("/signup")}
      >
        <Text style={styles.buttonText}>Start Now!</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  image: {
    width: 350,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#17b8a6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});