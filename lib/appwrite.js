import { Client, Account, ID, Databases, Storage, Query } from 'appwrite';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67f69e1c002d4b97073a');

const account = new Account(client);

const databases = new Databases(client);
const storage = new Storage(client);

// Database and collection configuration
const DATABASE_ID = '67f6a679000cfddabb05';
const PROPERTIES_COLLECTION_ID = '680485ea00379bb46302';
const BUCKET_ID = '67fa77ef00297ab9936b';
const TENANTS_COLLECTION_ID = '680488df00384099c27a';

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
    const verificationUrl = 'http://localhost:8081/(auth)/verify';
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

export async function addProperty(propertyData, imageUri) {
  try {
    console.log("Adding new property:", propertyData);
    console.log("Checking user session...");
    const user = await getCurrentUser();
    console.log("User session:", user ? user.$id : 'No user');
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Validate required fields
    if (!propertyData.propertyName) {
      throw new Error("Property name is required");
    }
    if (!propertyData.propertyType) {
      throw new Error("Property type is required");
    }
    
    let imageId = null;
    if (imageUri) {
      console.log("Uploading property image...");
      let file;
      if (Platform.OS === 'web') {
        console.log("Platform is web, fetching image as blob...");
        const response = await fetch(imageUri);
        const blob = await response.blob();
        file = new File([blob], `property_${Date.now()}.jpg`, { type: 'image/jpeg' });
      } else {
        console.log("Platform is native, reading image with FileSystem...");
        const fileContent = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        file = {
          name: `property_${Date.now()}.jpg`,
          type: 'image/jpeg',
          content: fileContent,
        };
      }
      
      try {
        console.log("Uploading to bucket:", BUCKET_ID);
        const fileUpload = await storage.createFile(BUCKET_ID, ID.unique(), file);
        imageId = fileUpload.$id;
        console.log("Image uploaded successfully with ID:", imageId);
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        // Continue without image if upload fails
      }
    }
    
    console.log("Creating document in collection:", PROPERTIES_COLLECTION_ID);
    
    const rentPrice = propertyData.rentPrice ? parseInt(propertyData.rentPrice, 10) : 0;
    if (isNaN(rentPrice)) {
      throw new Error("rentPrice must be a valid number");
    }
    
    const bedrooms = propertyData.bedrooms ? parseInt(propertyData.bedrooms, 10) : null;
    if (propertyData.bedrooms && isNaN(bedrooms)) {
      throw new Error("bedrooms must be a valid number");
    }
    
    const bathrooms = propertyData.bathrooms ? parseInt(propertyData.bathrooms, 10) : null;
    if (propertyData.bathrooms && isNaN(bathrooms)) {
      throw new Error("bathrooms must be a valid number");
    }
    
    
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    
   
    const documentId = ID.unique();
    console.log("Generated document ID:", documentId);
    
    const property = await databases.createDocument(
      DATABASE_ID,
      PROPERTIES_COLLECTION_ID,
      documentId,
      {
        propertyName: propertyData.propertyName.trim(),
        propertyType: propertyData.propertyType,
        category: propertyData.category ? propertyData.category.trim() : "",
        address: propertyData.address ? propertyData.address.trim() : "",
        state: propertyData.state ? propertyData.state.trim() : "",
        city: propertyData.city ? propertyData.city.trim() : "",
        postCode: propertyData.postCode ? propertyData.postCode.trim() : "",
        rentPrice: rentPrice,
        description: propertyData.description ? propertyData.description.trim() : "",
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        imageId: imageId,
        ownerId: user.$id,
        createdAt: createdAt,
        status: 'vacant',
      }
    );
    
    console.log("Property added successfully:", property.$id);
    
    // Return the property with consistent id field and imageUrl like in getProperties
    let imageUrl = null;
    if (imageId) {
      try {
        // Generate the image URL
        imageUrl = storage.getFileView(BUCKET_ID, imageId).href;
      } catch (error) {
        console.error('Error getting property image URL:', error);
      }
    }
    
    // Return a consistent property object structure
    return {
      ...property,
      id: property.$id,  // Make sure we map $id to id for UI consistency
      imageUrl
    };
  } catch (error) {
    console.error('Add property error:', JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function addTenant(tenantData, imageUri) {
  try {
    console.log("Adding new tenant:", tenantData);
    console.log("Checking user session...");
    const user = await getCurrentUser();
    console.log("User session:", user ? user.$id : 'No user');
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    let imageId = null;
    if (imageUri) {
      console.log("Uploading tenant image...");
      let file;
      if (Platform.OS === 'web') {
        console.log("Platform is web, fetching image as blob...");
        const response = await fetch(imageUri);
        const blob = await response.blob();
        file = new File([blob], `tenant_${Date.now()}.jpg`, { type: 'image/jpeg' });
      } else {
        console.log("Platform is native, reading image with FileSystem...");
        const fileContent = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        file = {
          name: `tenant_${Date.now()}.jpg`,
          type: 'image/jpeg',
          content: fileContent,
        };
      }
      console.log("Uploading to bucket:", BUCKET_ID);
      const fileUpload = await storage.createFile(BUCKET_ID, ID.unique(), file);
      imageId = fileUpload.$id;
      console.log("Image uploaded successfully with ID:", imageId);
    }
    
    // Format createdAt as a short date string (max 20 chars)
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    
    console.log("Creating tenant document in collection:", TENANTS_COLLECTION_ID);
    const tenant = await databases.createDocument(
      DATABASE_ID,
      TENANTS_COLLECTION_ID,
      ID.unique(),
      {
        name: tenantData.name,
        email: tenantData.email,
        phone: tenantData.phone,
        state: tenantData.state || "",
        city: tenantData.city || "",
        imageId: imageId,
        userId: user.$id,
        createdAt: createdAt, // Using shortened date format
      }
    );
    console.log("Tenant added successfully:", tenant.$id);
    return tenant;
  } catch (error) {
    console.error('Add tenant error:', JSON.stringify(error, null, 2));
    throw error;
  }
}

export const getProperties = async () => {
  try {
    // Get the current authenticated user
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    console.log("Fetching properties for user:", currentUser.$id);
    
    // Fetch properties from the database
    const response = await databases.listDocuments(
      DATABASE_ID,
      PROPERTIES_COLLECTION_ID,
      [
        Query.equal('ownerId', currentUser.$id), // Filter by ownerId for security
        Query.orderDesc('$createdAt'), // Sort by creation date
      ]
    );
    
    console.log(`Found ${response.documents.length} properties`);
    
    // Process the images for each property
    const properties = await Promise.all(response.documents.map(async (property) => {
      let imageUrl = null;
      if (property.imageId) {
        try {
          // Generate the image URL as a plain string rather than URL object
          imageUrl = storage.getFileView(BUCKET_ID, property.imageId).href;
        } catch (error) {
          console.error('Error getting property image:', error);
        }
      }
      
      // Return property with consistent id field
      return {
        ...property,
        id: property.$id, // Map $id to id for consistent access in frontend
        imageUrl,
      };
    }));
    
    return properties;
  } catch (error) {
    console.error("Error in getProperties:", error.message);
    throw error;
  }
};

export const getTenants = async () => {
  try {
    // Get the current authenticated user
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Fetch tenants from the database
    const response = await databases.listDocuments(
      DATABASE_ID,
      TENANTS_COLLECTION_ID,
      [
        // Optional: Add queries to filter tenants by the current user
        Query.equal('userId', currentUser.$id),
      ]
    );
    
    // Process the images for each tenant
    const tenants = await Promise.all(response.documents.map(async (tenant) => {
      // If tenant has an imageId, get the image URL
      let imageUrl = null;
      if (tenant.imageId) {
        try {
          // Create a URL for the image if it exists
          imageUrl = storage.getFileView(BUCKET_ID, tenant.imageId).href; // Added .href here
        } catch (error) {
          console.error('Error getting tenant image:', error);
        }
      }
      
      // Return tenant with image URL
      return {
        ...tenant,
        id: tenant.$id, // Add consistent id field like in getProperties
        imageUrl
      };
    }));
    
    return tenants;
  } catch (error) {
    console.error("Error in getTenants:", error.message);
    throw error;
  }
};

export async function deleteProperty(propertyId) {
  if (!propertyId) {
    throw new Error("Property ID is required");
  }
  
  // Always convert to string to ensure consistent comparison
  const id = String(propertyId);
  console.log("Deleting property with ID:", id);
  
  try {
    // Verify user authentication first
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      const error = new Error("User not authenticated");
      error.code = 401;
      throw error;
    }
    
    // Get the property document first to verify ownership
    let property;
    try {
      property = await databases.getDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        id
      );
    } catch (docError) {
      if (docError.code === 404) {
        console.log("Property not found or already deleted:", id);
        return true; // Consider this a success since the property is gone
      }
      throw docError; // Re-throw other errors
    }
    
    // Verify ownership with string conversion for consistency
    if (String(property.ownerId) !== String(currentUser.$id)) {
      const error = new Error("You don't have permission to delete this property");
      error.code = 403;
      throw error;
    }
    
    // If property has an image, try to delete it
    if (property.imageId) {
      try {
        console.log("Deleting property image:", property.imageId);
        await storage.deleteFile(BUCKET_ID, property.imageId);
        console.log("Property image deleted successfully");
      } catch (imageError) {
        console.error("Image deletion error:", imageError);
        // Continue even if image deletion fails
      }
    }
    
    // Delete the property document
    await databases.deleteDocument(
      DATABASE_ID,
      PROPERTIES_COLLECTION_ID,
      id
    );
    
    console.log("Property deleted successfully");
    return true;
  } catch (error) {
    console.error("Delete property error:", error);
    throw error;
  }
}


export { client, account };