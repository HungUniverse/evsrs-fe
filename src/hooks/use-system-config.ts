import { useEffect, useState, useCallback } from "react";
import { SystemConfig } from "@/apis/system-config.api";

const STORAGE_PREFIX = "system_config_";

// Hook để lấy config từ localStorage hoặc API
export function useSystemConfig(key: string) {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageKey = `${STORAGE_PREFIX}${key}`;

  // Fetch from API and save to localStorage
  const fetchAndSave = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await SystemConfig.getByKey(key);
      const configValue = response.value || "";

      // Save to localStorage
      localStorage.setItem(storageKey, configValue);
      setValue(configValue);
    } catch (err) {
      console.error(`Failed to fetch system config for key: ${key}`, err);
      setError(`Failed to fetch config: ${key}`);
    } finally {
      setLoading(false);
    }
  }, [key, storageKey]);

  // Get from localStorage first
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setValue(stored);
    }
  }, [storageKey]);

  return {
    value,
    loading,
    error,
    fetchAndSave,
    refresh: fetchAndSave,
  };
}

// Utility functions
export const SystemConfigUtils = {
  // Get config value from localStorage
  get: (key: string): string | null => {
    return localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  },

  // Set config value to localStorage
  set: (key: string, value: string): void => {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
  },

  // Remove config from localStorage
  remove: (key: string): void => {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  },

  // Get deposit amount (Tiền cọc) - this is actually percentage
  getDepositAmount: (): number => {
    const value = SystemConfigUtils.get("Tiền cọc");
    return value ? parseFloat(value) || 0 : 0;
  },

  // Get deposit percentage (Tiền cọc) - clearer name
  getDepositPercent: (): number => {
    return SystemConfigUtils.getDepositAmount();
  },

  // Fetch deposit amount from API and save to localStorage
  fetchDepositAmount: async (): Promise<number> => {
    try {
      const response = await SystemConfig.getByKey("Tiền cọc");
      const value = response.value || "0";
      SystemConfigUtils.set("Tiền cọc", value);
      return parseFloat(value) || 0;
    } catch (error) {
      console.error("Failed to fetch deposit amount:", error);
      return 0;
    }
  },
};
