import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Import Firebase configuration
import { firebaseConfig } from "../components/firebase"; // Corrected path

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    login: async (email, password) => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Login error:", error.message);
        throw error; // Handle error in UI
      }
    },
    logout: async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Logout error:", error.message);
        throw error; // Handle error in UI
      }
    },
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// Custom Hook for using Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};
