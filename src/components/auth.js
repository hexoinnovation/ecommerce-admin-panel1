import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Import Firebase configuration
import { firebaseConfig } from "../components/firebase"; // Correct the path as needed

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set the current user
      setLoading(false); // Set loading to false after checking auth state
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  const value = {
    currentUser,
    setCurrentUser, // Allow manual setting of the current user if needed
    login: async (email, password) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setCurrentUser(userCredential.user); // Update state with the logged-in user
      } catch (error) {
        console.error("Login error:", error.message);
        throw error; // Rethrow for UI handling
      }
    },
    logout: async () => {
      try {
        await signOut(auth);
        setCurrentUser(null); // Clear the current user on logout
      } catch (error) {
        console.error("Logout error:", error.message);
        throw error; // Rethrow for UI handling
      }
    },
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// Custom Hook for using Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};
