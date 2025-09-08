import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { router } from "expo-router";

interface User {
  name: string;
  email?: string;
  hasCompletedOnboarding: boolean;
  notifications: boolean;
  privateMode: boolean;
}

const STORAGE_KEY = "@user_storage";

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage
  const loadUser = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save user to storage
  const saveUser = useCallback(async (userToSave: User) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userToSave));
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }, []);

  // Update user
  const updateUser = useCallback(async (updates: Partial<User>) => {
    const updatedUser = { ...user, ...updates } as User;
    setUser(updatedUser);
    await saveUser(updatedUser);
  }, [user, saveUser]);

  // Check onboarding
  const checkOnboarding = useCallback(() => {
    if (!isLoading && (!user || !user.hasCompletedOnboarding)) {
      router.replace("/onboarding");
    }
  }, [user, isLoading]);

  // Logout
  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
    router.replace("/onboarding");
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    checkOnboarding();
  }, [checkOnboarding]);

  return {
    user,
    isLoading,
    updateUser,
    checkOnboarding,
    logout,
  };
});