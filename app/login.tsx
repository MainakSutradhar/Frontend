import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    role: "user" | "admin";
    rollNo: string | null;
    facultyId: string | null;
  };
};

type ApiErrorResponse = {
  message?: string;
};

const getApiErrorMessage = (data: LoginResponse | ApiErrorResponse): string => {
  if ("message" in data && typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }
  return "Invalid credentials";
};

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const API_BASE_URL = "https://localhost:5000";

  const login = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      const data = (await res.json()) as LoginResponse | ApiErrorResponse;

      if (!res.ok) {
        Alert.alert("Login failed", getApiErrorMessage(data));
        return;
      }

      const loginData = data as LoginResponse;
      await SecureStore.setItemAsync("accessToken", loginData.accessToken);
      await SecureStore.setItemAsync("refreshToken", loginData.refreshToken);
      await SecureStore.setItemAsync("currentUser", JSON.stringify(loginData.user));

      if (loginData.user.role === "admin") {
        router.replace("/(admin)/panel");
      } else {
        router.replace("/(student)/home");
      }

    } catch {
      Alert.alert("Error", "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={login}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>
          Don’t have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  button: {
    backgroundColor: "#2ECC71",
    padding: 14,
    borderRadius: 8,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: "#2ECC71"
  }
});
