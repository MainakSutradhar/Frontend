import { Alert, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "@/utils/api";
import { useFocusEffect } from "@react-navigation/native";

type BalanceResponse = { balance: number; message?: string };

export default function redeem() {
  const [balance, setBalance] = useState<number>(0);

  const loadBalance = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (!accessToken) return;

      const res = await fetch(`${API_BASE_URL}/api/tokens/balance`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const data = (await res.json()) as BalanceResponse | { message?: string };
      if (!res.ok) {
        if ("message" in data && data.message) Alert.alert("Error", data.message);
        return;
      }

      if ("balance" in data) setBalance(data.balance);
    } catch {
      // keep silent to avoid repeated alerts on flaky networks
    }
  };

  useFocusEffect(() => {
    loadBalance();
  });

  useEffect(() => {
    loadBalance();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redeem</Text>
      <Text style={styles.subtitle}>
        Scan an admin QR from the <Text style={styles.green}>Scan</Text> tab to redeem tokens.
      </Text>
      <Text style={styles.balance}>Current balance: {balance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  subtitle: { color: "#6b7280", marginBottom: 16 },
  green: { color: "#2ECC71", fontWeight: "700" },
  balance: { fontWeight: "700", fontSize: 16 }
});
