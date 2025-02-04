import React, { createContext, useState } from "react";

// Define different layouts with dynamic font colors
const layouts = {
  light: {
    primaryColor: "#3b82f6", // Blue
    backgroundColor: "#f3f4f6", // Light Gray
    sidebarColor: "#00008B", // White Sidebar
    buttonColor: "#1e40af", // Dark Blue Button
    fontColor: "#000000", // Black text for light theme
  },
  dark: {
    primaryColor: "#1f2937", // Dark Gray
    backgroundColor: "#111827", // Dark Background
    sidebarColor: "#2d3748", // Dark Sidebar
    buttonColor: "#4b5563", // Gray Button
    fontColor: "#ffffff", // White text for dark theme
  },
  colorful: {
    primaryColor: "#ff6347", // Tomato Red
    backgroundColor: "#f0fdfa", // Light Teal
    sidebarColor: "#e11d48", // Bright Red Sidebar
    buttonColor: "#d97706", // Orange Button
    fontColor: "#ffffff", // White text for colorful theme
  },
  vibrant: {
    primaryColor: "#d97706", // Orange
    backgroundColor: "#f5f5f5", // Light Gray Background
    sidebarColor: "#fbbf24", // Yellow Sidebar
    buttonColor: "#f59e0b", // Bright Orange Button
    fontColor: "#111827", // Dark font color for vibrant theme
  },
  professional: {
    primaryColor: "#0d4f8b", // Blue
    backgroundColor: "#f8f8f8", // Light Gray Background
    sidebarColor: "#1a202c", // Dark Sidebar
    buttonColor: "#0d4f8b", // Blue Button
    fontColor: "#ffffff", // White font for professional theme
  },
  modern: {
    primaryColor: "#ff4081", // Pink
    backgroundColor: "#f3e578", // Light Pink Background
    sidebarColor: "#ff80ab", // Pink Sidebar
    buttonColor: "#f50057", // Deep Pink Button
    fontColor: "#000000", // Black font for modern theme
  },
  elegant: {
    primaryColor: "#6b21a8", // Purple
    backgroundColor: "#f3f489", // Light Gray
    sidebarColor: "#9b4d96", // Purple Sidebar
    buttonColor: "#9333ea", // Purple Button
    fontColor: "#ffffff", // White font for elegant theme
  },
};

// Create ThemeContext
export const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
  const [layout, setLayout] = useState(layouts.light); // Default layout is light

  const changeLayout = (layoutName) => {
    setLayout(layouts[layoutName]);
  };

  return (
    <ThemeContext.Provider value={{ layout, changeLayout }}>
      {children}
    </ThemeContext.Provider>
  );
};
