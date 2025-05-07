// lib/authService.ts

import { account, ID } from "./appwrite";
import type { Models } from "appwrite";
import { useEffect, useState } from "react";

type VerificationResponse = {
  $id: string;
  $createdAt: string;
  userId: string;
  secret: string;
  expire: string;
};

export async function registerUser({
  name,
  email,
  password,
}: {
  name?: string;
  email: string;
  password: string;
}): Promise<{
  user: Models.User<Models.Preferences>;
  session: Models.Session;
  verification: VerificationResponse;
}> {
  const user = await account.create(ID.unique(), email, password, name);
  const session = await account.createEmailPasswordSession(email, password);
  const verification = await account.createVerification("appscheme://verify");

  return { user, session, verification };
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{
  user: Models.User<Models.Preferences>;
  session: Models.Session;
}> {
  await account.deleteSession("current").catch(() => { });
  const session = await account.createEmailPasswordSession(email, password);
  const user = await account.get();
  return { user, session };
}

export async function isEmailVerified(): Promise<boolean> {
  const user = await account.get();
  return user.emailVerification;
}

export async function resendVerification(): Promise<VerificationResponse> {
  return await account.createVerification("appscheme://verify");
}

export async function verifyEmail(userId: string, secret: string): Promise<VerificationResponse> {
  return await account.updateVerification(userId, secret);
}

export async function getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  await account.deleteSession("current");
}

// ✅ HOOK: useAuth (to be used inside components)
export function useAuth() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return { user };
}
