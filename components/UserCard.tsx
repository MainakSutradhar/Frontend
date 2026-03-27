import { StyleSheet, Text, View } from "react-native";

export default function UserCard() {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Text>P</Text>
      </View>

      <View>
        <Text>User Name</Text>
        <Text>Wallet Address</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
