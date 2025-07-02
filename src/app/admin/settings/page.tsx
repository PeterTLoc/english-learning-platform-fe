"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { parseAxiosError } from "@/utils/apiErrors";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import * as configService from "@/services/configService";
import { Config } from "@/services/configService";

interface ConfigFormData {
  [key: string]: {
    value: string;
    description: string;
  };
}

const formatConfigKey = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const SettingsPage = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configs, setConfigs] = useState<Config[]>([]);
  const [formData, setFormData] = useState<ConfigFormData>({});
  const [originalData, setOriginalData] = useState<ConfigFormData>({});

  const fetchConfigs = async () => {
    try {
      const fetchedConfigs = await configService.getAllConfigs();
      setConfigs(fetchedConfigs);
      
      const configData: ConfigFormData = {};
      fetchedConfigs.forEach((config) => {
        configData[config.key] = {
          value: config.value,
          description: config.description || ""
        };
      });
      
      setFormData(configData);
      setOriginalData(configData);
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Only update configs that have changed
      const updates = Object.entries(formData).filter(
        ([key, data]) => data.value !== originalData[key].value
      );

      await Promise.all(
        updates.map(([key, data]) =>
          configService.updateConfig(key, data.value, data.description)
        )
      );

      setOriginalData(formData);
      showToast("Settings updated successfully", "success");
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(originalData);
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 justify-center py-20">
        <LoadingSpinner />
        <p className="ml-3 text-[#CFCFCF]">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">System Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {configs.map((config) => (
            <div
              key={config.key}
              className="bg-[#202020] border border-[#1D1D1D] p-4 rounded-lg"
            >
              <label className="block text-lg font-medium text-[#CFCFCF] mb-2">
                {formatConfigKey(config.key)}
              </label>
              {config.description && (
                <p className="text-sm text-[#808080] mb-2">{config.description}</p>
              )}
              <div className="number-input-wrapper">
                <input
                  type="number"
                  value={formData[config.key]?.value || ""}
                  onChange={(e) => handleInputChange(config.key, e.target.value)}
                  className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2 text-white"
                  required
                  min="0"
                  step={config.key.includes("point") ? "0.01" : "1"}
                />
                <div className="number-input-controls">
                  <button
                    type="button"
                    className="number-input-button"
                    onClick={() => {
                      const currentValue = parseFloat(formData[config.key]?.value || "0");
                      const step = config.key.includes("point") ? 0.01 : 1;
                      handleInputChange(config.key, (currentValue + step).toString());
                    }}
                    disabled={saving}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="number-input-button"
                    onClick={() => {
                      const currentValue = parseFloat(formData[config.key]?.value || "0");
                      const step = config.key.includes("point") ? 0.01 : 1;
                      const newValue = Math.max(0, currentValue - step);
                      handleInputChange(config.key, newValue.toString());
                    }}
                    disabled={saving}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-end mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 bg-[#2b2b2b] text-white font-semibold rounded-md hover:bg-[#373737] transition-colors"
            disabled={saving}
          >
            Reset Changes
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#4CC2FF] text-black font-semibold rounded-md hover:bg-[#3AA0DB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage; 