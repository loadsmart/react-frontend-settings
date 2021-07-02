import { createContext } from 'react';

export interface SettingsProviderValue {
  settings: Record<string, unknown | null>;
  flags: Record<string, boolean | null>;
  isLoading: boolean;
}

const providerValue: SettingsProviderValue = {
  settings: {},
  flags: {},
  isLoading: false,
};

export const SettingsContext = createContext(providerValue);
