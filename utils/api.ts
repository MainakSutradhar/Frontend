import Constants from "expo-constants";

const configuredBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
  process.env.API_BASE_URL?.trim();
const expoHost = Constants.expoConfig?.hostUri?.split(":")[0];

const fallbackBaseUrl =
  configuredBaseUrl && configuredBaseUrl.length > 0
    ? configuredBaseUrl
    : expoHost
      ? `http://${expoHost}:5000`
      : "http://localhost:5000";

export const API_BASE_URL = fallbackBaseUrl.replace(/\/+$/, "");
