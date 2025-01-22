// src/components/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Assuming you're exporting your firebase config here

// Create a context to manage authentication state
const AuthContext = createContext();

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook to consume the context
export const useAuth = () => {
  return useContext(AuthContext);
};
