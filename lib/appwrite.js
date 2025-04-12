import { Client, Account, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67f69e1c002d4b97073a');

const account = new Account(client);

interface UserCredentials {
  name?: string;
  email: string;
  password: string;
}

export async function registerUser({ name, email, password }: UserCredentials) {
  try {
    console.log("Creating user account...");
    const user = await account.create(ID.unique(), email, password, name);
    console.log("User created successfully:", user);
    
    console.log("Creating session for new user...");
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session created successfully:", session);
    
    const verificationUrl = 'http://localhost:8081/(auth)/verify';
    try {
      console.log("Creating verification...");
      const verification = await account.createVerification(verificationUrl);
      console.log("Verification created successfully:", verification);
      console.log("==========================================");
      console.log("VERIFICATION LINK (for testing):");
      console.log(`${verificationUrl}?userId=${user.$id}&secret=${verification.secret}`);
      console.log("==========================================");
      return { user, verification, session };
    } catch (verificationError) {
      console.error("Verification creation failed:", verificationError);
      console.error("Full verification error:", JSON.stringify(verificationError, null, 2));
      return { user, verification: null, session };
    }
  } catch (error) {
    console.error('Registration error (DETAILED):', JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function loginUser({ email, password }: UserCredentials) {
  try {
    // Check for existing session and delete it
    try {
      console.log("Checking for existing session...");
      await account.getSession('current');
      console.log("Existing session found, deleting...");
      await account.deleteSession('current');
      console.log("Existing session deleted");
    } catch (e) {
      console.log("No existing session found or error checking:", e.message);
    }

    console.log("Creating new session for:", { email });
    const session = await account.createEmailPasswordSession(email.trim(), password);
    console.log("Session created successfully:", session);
    console.log("Getting user info...");
    const user = await account.get();
    console.log("User info retrieved successfully:", user);
    return { user, session };
  } catch (error) {
    console.error('Login error (DETAILED):', JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function verifyEmail(userId: string, secret: string) {
  try {
    console.log("Verifying email with userId:", userId, "and secret:", secret);
    const result = await account.updateVerification(userId, secret);
    console.log("Email verification result:", result);
    return result;
  } catch (error) {
    console.error('Email verification error (DETAILED):', JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function resendVerification() {
  try {
    const verificationUrl = 'http://localhost:8081/(auth)/verify'; // Fixed URL for mobile
    console.log("Creating new verification with URL:", verificationUrl);
    const verification = await account.createVerification(verificationUrl);
    console.log("==========================================");
    console.log("RESENT VERIFICATION LINK (for testing):");
    console.log(`${verificationUrl}?userId=${verification.userId}&secret=${verification.secret}`);
    console.log("==========================================");
    return verification;
  } catch (error) {
    console.error('Resend verification error (DETAILED):', JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function isEmailVerified() {
  try {
    const user = await account.get();
    return user.emailVerification;
  } catch (error) {
    console.error('Email verification check error:', error);
    return false;
  }
}

export async function logoutUser() {
  try {
    await account.deleteSession('current');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export { client, account };