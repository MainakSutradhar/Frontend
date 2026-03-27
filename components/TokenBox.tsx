import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL } from "@/utils/api";

export default function TokenBox() {
  const [balance, setBalance] = useState<number>(0);

  const loadBalance = useCallback(async () => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    if (!accessToken) return;

    const res = await fetch(`${API_BASE_URL}/api/tokens/balance`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) return;

    const data = (await res.json()) as { balance?: number; message?: string };
    if (typeof data.balance === "number") setBalance(data.balance);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBalance();
    }, [loadBalance])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tokens</Text>
      <Text style={styles.value}>{balance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  }
});
