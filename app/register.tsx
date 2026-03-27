import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const API_BASE_URL = "https://unfrilly-rashida-isographical.ngrok-free.dev";

  const register = async (): Promise<void> => {
    if (!firstName || !lastName || !rollNo || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            middleName,
            lastName,
            rollNo,
            email,
            password
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Registration failed");
        return;
      }

      Alert.alert("Success", data.message || "OTP sent to your email");
      
      router.push({
        pathname: "/verify-otp",//need to change
        params: { email }
      });

    } catch {
      Alert.alert("Error", "Server not reachable");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="First Name"
        placeholderTextColor={styles.myPlaceholderColor.color}
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        placeholder="Middle Name (Optional)"
        placeholderTextColor={styles.myPlaceholderColor.color}
        style={styles.input}
        value={middleName}
        onChangeText={setMiddleName}
      />

      <TextInput
        placeholder="Last Name"
        placeholderTextColor={styles.myPlaceholderColor.color}
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        placeholder="Roll Number"
        placeholderTextColor={styles.myPlaceholderColor.color}
        style={styles.input}
        value={rollNo}
        onChangeText={setRollNo}
        autoCapitalize="characters"
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor={styles.myPlaceholderColor.color}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={styles.myPlaceholderColor.color}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor={styles.myPlaceholderColor.color}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />


      <TouchableOpacity
        style={styles.button}
        onPress={register}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>
          Already have an account? Login
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
    borderColor: "#5b2121",
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
  },
  myPlaceholderColor:{
    color: "#888"
  }
});