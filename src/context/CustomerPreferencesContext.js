"use client";
import { useContext, useState, createContext } from "react";

const CustomerPreferencesContext = createContext();
export const useCustomerPreferences = () => {
};
export const CustomerPreferencesProvider = ({ children }) => {

 
  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  };

  return (
    <CustomerPreferencesContext.Provider
      value={{ preferences, updatePreference, getPreference }}
    >
      {children}
    </CustomerPreferencesContext.Provider>
  );
};
