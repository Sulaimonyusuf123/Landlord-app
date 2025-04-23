import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { registerUser } from "../../lib/appwrite";

const RegisterScreen = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignUp = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    
    if (!email) {
      setErrorMessage("Please enter an email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Starting registration process with:", { name, email, password: "****" });
      const response = await registerUser({
        name: name || undefined,
        email: email.trim(),
        password,
      });

      console.log("Registration response:", response);
      const { user, verification, session } = response || {};

      if (!user) {
        throw new Error("User creation failed, no user returned.");
      }

      if (verification) {
        setSuccessMessage("Verification link sent! Please check your email to verify your account.");
        console.log("Verification sent successfully:", { user, verification });
        setTimeout(() => router.replace("/(auth)/login"), 3000); 
      } else {
        setSuccessMessage(
          "Account created, but we couldn’t send the verification email. Please try logging in to request a new one."
        );
        console.log("Verification failed, but user created:", { user });
        setTimeout(() => router.replace("/(auth)/login"), 3000); 
      }
    } catch (error) {
      console.error("Registration error (FULL):", JSON.stringify(error, null, 2));
      const errorDetails = error?.response ? JSON.stringify(error.response) : "No response details";
      console.error("Error details:", errorDetails);

      if (error?.code === 409 || 
          (error?.message && (
            error.message.includes("user with the same email already exists") ||
            error.message.includes("email already exists") ||
            error.message.includes("A user with the same email") ||
            error.message.includes("already registered")
          ))) {
        setErrorMessage("This email is already registered. Please use a different email or sign in.");
      } else if (error?.message && (
          error.message.includes("Invalid email") || 
          error.message.includes("email address")
      )) {
        setErrorMessage("Please enter a valid email address.");
      } else if (error?.message) {
        setErrorMessage(`Registration failed: ${error.message}`);
      } else {
        setErrorMessage("Registration failed. Please check the console for details.");
      }
    } finally {
      setIsLoading(false);
      console.log("Signup attempt completed, isLoading:", false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Create an account to continue!</Text>

        {successMessage ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrorMessage("");
            setSuccessMessage("");
          }}
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Email*"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMessage("");
            setSuccessMessage("");
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            setErrorMessage("");
            setSuccessMessage("");
          }}
          keyboardType="phone-pad"
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Password* (min 8 characters)"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage("");
            setSuccessMessage("");
          }}
          secureTextEntry
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password*"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrorMessage("");
            setSuccessMessage("");
          }}
          secureTextEntry
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.buttonText}> Signing Up...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")} disabled={isLoading}>
            <Text style={styles.signInLink}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  successContainer: {
    width: "100%",
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#00BFA6",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  successText: {
    color: "#00BFA6",
    fontSize: 14,
    textAlign: "center",
  },
  errorContainer: {
    width: "100%",
    backgroundColor: "#FFE8E8",
    borderWidth: 1,
    borderColor: "#FF5A5A",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#00BFA6",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    backgroundColor: "#00BFA6",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#A0E6D9",
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signInContainer: {
    flexDirection: "row",
  },
  signInText: {
    fontSize: 14,
    color: "#333",
  },
  signInLink: {
    fontSize: 14,
    color: "#00BFA6",
    fontWeight: "bold",
  },
});

export default RegisterScreen;