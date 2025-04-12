import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { verifyEmail } from "../../lib/appwrite";

const VerifyScreen = () => {
  const router = useRouter();
  console.log("useLocalSearchParams:", useLocalSearchParams);
  const params = useLocalSearchParams();
  console.log("params:", params);
  const userId = params.userId;
  const secret = params.secret;

  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState("");

  useEffect(() => {
    console.log("VerifyScreen mounted with params:", { userId, secret });
    const performVerification = async () => {
      if (!userId || !secret) {
        setIsVerifying(false);
        setVerificationStatus("Invalid verification link. Missing required parameters.");
        return;
      }

      try {
        console.log("Starting email verification with userId:", userId, "secret:", secret);
        await verifyEmail(userId, secret);
        setVerificationStatus("Email verified successfully!");
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 2000);
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("Verification failed. Please try again or contact support.");
      } finally {
        setIsVerifying(false);
      }
    };

    performVerification();
  }, [userId, secret, router]);

  return (
    <View style={styles.container}>
      {isVerifying ? (
        <>
          <ActivityIndicator size="large" color="#00BFA6" />
          <Text style={styles.text}>Verifying your email...</Text>
        </>
      ) : (
        <>
          <Text
            style={[
              styles.statusText,
              verificationStatus.includes("successfully") ? styles.successText : styles.errorText,
            ]}
          >
            {verificationStatus}
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// Styles unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginTop: 10,
    color: "#333",
  },
  statusText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  successText: {
    color: "#00BFA6",
  },
  errorText: {
    color: "#D32F2F",
  },
  button: {
    backgroundColor: "#00BFA6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default VerifyScreen;