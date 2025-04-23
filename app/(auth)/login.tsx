import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { loginUser, resendVerification, isEmailVerified, logoutUser } from "../../lib/appwrite";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showResendButton, setShowResendButton] = useState(false);

  const handleLogin = async () => {
    setErrorMessage("");
    setShowResendButton(false);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      console.log("Missing email or password:", { email, password: "****" });
      return;
    }

    setIsLoading(true);
    console.log("Starting login attempt:", { email: email.trim(), password: "****" });

    try {
      console.log("Calling loginUser...");
      const response = await loginUser({ email: email.trim(), password });
      console.log("loginUser response:", response);
      const { user, session } = response || {};
      
     
      console.log("Checking if email is verified...");
      const verified = await isEmailVerified();
      console.log("Email verification status:", verified);
      
      if (!verified) {
      
        console.log("Email not verified, showing verification prompt");
        setErrorMessage("Your email address has not been verified. Please check your inbox for the verification email we sent when you registered.");
        setShowResendButton(true);
        
       
        try {
          await logoutUser();
          console.log("Logged out unverified user");
        } catch (logoutError) {
          console.error("Error logging out unverified user:", logoutError);
        }
        
        setIsLoading(false);
        return;
      }
      
      
      console.log("Login successful with verified email:", { user, session });
      console.log("Navigating to /(tabs)/dashboard...");
      router.replace("/(tabs)/dashboard");
      console.log("Navigation triggered");
    } catch (error) {
      console.error("Login error caught in LoginScreen:", {
        code: error.code,
        message: error.message,
        type: error.type,
        stack: error.stack,
        fullError: JSON.stringify(error, null, 2),
      });
      if (error.code === 401) {
        if (error.type === "user_session_already_exists") {
          setErrorMessage("A session is already active. Please try again.");
        } else if (error.message.toLowerCase().includes("email not verified")) {
          setErrorMessage("Your email address has not been verified. Please check your inbox for the verification email.");
          setShowResendButton(true);
        } else {
          setErrorMessage("Invalid email or password.");
        }
      } else if (error.code === 429) {
        setErrorMessage("Too many login attempts. Please try again later.");
      } else {
        setErrorMessage(`Login failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsLoading(false);
      console.log("Login attempt completed, isLoading:", false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      console.log("Attempting to resend verification...");
      await resendVerification();
      Alert.alert(
        "Verification Email Sent", 
        "We've sent a new verification email to your address. Please check your inbox and click the verification link to activate your account.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Resend verification error in LoginScreen:", {
        code: error.code,
        message: error.message,
        type: error.type,
        fullError: JSON.stringify(error, null, 2),
      });
      setErrorMessage(`Failed to resend verification: ${error.message || "Unknown error"}`);
    } finally {
      setIsResending(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Password Reset", "Please contact support to reset your password.", [
      { text: "OK" },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require("../../assets/images/log01.png")} style={styles.logo} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={(text) => {
            setEmail(text.trim());
            setErrorMessage("");
            setShowResendButton(false);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage("");
            setShowResendButton(false);
          }}
          secureTextEntry
          editable={!isLoading}
        />
        <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.signInButton, isLoading && styles.buttonDisabled]}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.signInText}> Signing In...</Text>
            </View>
          ) : (
            <Text style={styles.signInText}>Sign In</Text>
          )}
        </TouchableOpacity>
        {showResendButton && (
          <TouchableOpacity
            style={[styles.resendButton, isResending && styles.buttonDisabled]}
            onPress={handleResendVerification}
            disabled={isResending}
          >
            {isResending ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.resendButtonText}> Sending...</Text>
              </View>
            ) : (
              <Text style={styles.resendButtonText}>Resend Verification Email</Text>
            )}
          </TouchableOpacity>
        )}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")} disabled={isLoading}>
            <Text style={styles.signUpLink}> Sign Up</Text>
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
  logo: {
    width: 350,
    height: 250,
    marginBottom: 10,
    resizeMode: "contain",
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
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
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
  forgotPassword: {
    alignSelf: "flex-end",
    fontSize: 14,
    color: "#00BFA6",
    marginBottom: 20,
  },
  signInButton: {
    width: "100%",
    backgroundColor: "#00BFA6",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  resendButton: {
    width: "100%",
    backgroundColor: "#5E8ED7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signInText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  resendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signUpContainer: {
    flexDirection: "row",
  },
  signUpText: {
    fontSize: 14,
    color: "#333",
  },
  signUpLink: {
    fontSize: 14,
    color: "#00BFA6",
    fontWeight: "bold",
  },
});

export default LoginScreen;