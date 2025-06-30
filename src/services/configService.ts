import api from "@/lib/api";

export interface Config {
  key: string;
  value: string;
  description?: string;
}

export const getAllConfigs = async (): Promise<Config[]> => {
  const response = await api.get("/api/configs");
  return response.data.configs;
};

export const updateConfig = async (key: string, value: string, description?: string): Promise<Config> => {
  if (parseFloat(value) < 0) {
    throw new Error("Value must be a positive number");
  }
  
  const response = await api.patch(`/api/configs/${key}`, { value, description });
  return response.data.config;
}; 