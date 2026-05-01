'use client';
import { createContext, useContext } from 'react';

const SettingsContext = createContext({});

export function SettingsProvider({ children, settings }) {
  // Normalize settings to ensure booleans are handled correctly
  const normalizedSettings = {
    ...settings,
    is_ecommerce: settings?.is_ecommerce === 'true' || settings?.is_ecommerce === true
  };

  return (
    <SettingsContext.Provider value={normalizedSettings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
