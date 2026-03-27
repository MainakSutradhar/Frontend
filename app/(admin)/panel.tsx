import { API_BASE_URL } from "@/utils/api";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

type AllowedStudent = {
  id: string;
  firstName: string;
  lastName: string;
  rollNo: string;
};

const getErrorMessage = async (res: Response, fallback: string) => {
  try {
    const data = (await res.json()) as { message?: string };
    return data.message || fallback;
  } catch {
    return fallback;
  }
};

export default function Panel() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [students, setStudents] = useState<AllowedStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAllowedStudents = async () => {
    try {
      setLoading(true);
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (!accessToken) {
        Alert.alert("Unauthorized", "Please login as admin again.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/allowed-students`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!res.ok) {
        const message = await getErrorMessage(res, "Failed to load allowed students");
        Alert.alert("Error", message);
        return;
      }

      const data = (await res.json()) as AllowedStudent[];
      setStudents(data);
    } catch {
      Alert.alert("Error", "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllowedStudents();
  }, []);

  const addStudent = async () => {
    if (!firstName.trim() || !lastName.trim() || !rollNo.trim()) {
      Alert.alert("Error", "First name, last name and roll no are required");
      return;
    }

    try {
      setSubmitting(true);
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (!accessToken) {
        Alert.alert("Unauthorized", "Please login as admin again.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/allowed-students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          rollNo: rollNo.trim().toUpperCase()
        })
      });

      if (!res.ok) {
        const message = await getErrorMessage(res, "Failed to add student");
        Alert.alert("Error", message);
        return;
      }

      const added = (await res.json()) as AllowedStudent;
      setStudents((prev) => [added, ...prev]);
      setFirstName("");
      setLastName("");
      setRollNo("");
      Alert.alert("Success", "Student added to allowed list");
    } catch {
      Alert.alert("Error", "Server not reachable");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>
      <Text style={styles.subtitle}>Add students allowed to register and login</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Roll No"
        value={rollNo}
        onChangeText={setRollNo}
        autoCapitalize="characters"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={addStudent}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Adding..." : "Add Student"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.listTitle}>Allowed Students</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchAllowedStudents}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? "Loading..." : "No allowed students yet"}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowName}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.rowRoll}>{item.rollNo}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff"
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
    marginBottom: 10
  },
  button: {
    backgroundColor: "#16a34a",
    borderRadius: 8,
    alignItems: "center",
    padding: 12,
    marginTop: 4,
    marginBottom: 18
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700"
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10
  },
  row: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8
  },
  rowName: {
    fontWeight: "600"
  },
  rowRoll: {
    color: "#6b7280",
    marginTop: 2
  },
  emptyText: {
    color: "#6b7280",
    textAlign: "center",
    marginTop: 24
  }
});
