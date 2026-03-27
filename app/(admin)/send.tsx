import { API_BASE_URL } from "@/utils/api";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import QRCode from "react-native-qrcode-svg";

type AdminSendResponse = {
  qrPayload: string;
  tokenCount: number;
  batchId?: string;
};

export default function Send() {
  const [tokenCount, setTokenCount] = useState<string>("");
  const [qrPayload, setQrPayload] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const generateQr = async () => {
    const parsed = Number(tokenCount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      Alert.alert("Error", "Enter a valid token count");
      return;
    }

    try {
      setSubmitting(true);
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (!accessToken) {
        Alert.alert("Unauthorized", "Please login as admin again.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/tokens/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ tokenCount: parsed })
      });

      const data = (await res.json()) as AdminSendResponse | { message?: string };

      if (!res.ok) {
        Alert.alert("Error", "message" in data ? data.message || "Send failed" : "Send failed");
        return;
      }

      if (!("qrPayload" in data) || !data.qrPayload) {
        Alert.alert("Error", "Backend did not return QR payload");
        return;
      }

      setQrPayload(data.qrPayload);
      Alert.alert("Success", "QR generated. Ask student to scan it.");
    } catch {
      Alert.alert("Error", "Server not reachable");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Send Tokens</Text>
      <Text style={styles.subtitle}>Generate a QR for students to redeem tokens</Text>

      <TextInput
        style={styles.input}
        value={tokenCount}
        onChangeText={setTokenCount}
        placeholder="Token Count"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={generateQr} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? "Generating..." : "Generate QR"}</Text>
      </TouchableOpacity>

      {qrPayload ? (
        <View style={styles.qrSection}>
          <Text style={styles.qrLabel}>Scan this QR</Text>
          <View style={styles.qrWrap}>
            <QRCode value={qrPayload} size={220} />
          </View>

          <Text style={styles.payloadLabel}>QR Payload (debug)</Text>
          <Text style={styles.payloadText} numberOfLines={6}>
            {qrPayload}
          </Text>
        </View>
      ) : (
        <Text style={styles.hint}>Enter token count and generate QR</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  button: {
    backgroundColor: "#16a34a",
    borderRadius: 8,
    alignItems: "center",
    padding: 12,
    marginBottom: 18
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700"
  },
  qrSection: {
    alignItems: "center",
    marginTop: 8
  },
  qrLabel: {
    fontWeight: "700",
    marginBottom: 10
  },
  qrWrap: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb"
  },
  payloadLabel: {
    marginTop: 16,
    color: "#6b7280",
    fontWeight: "700",
    alignSelf: "flex-start"
  },
  payloadText: {
    marginTop: 8,
    color: "#111827"
  },
  hint: {
    color: "#6b7280",
    marginTop: 16,
    textAlign: "center"
  }
});

