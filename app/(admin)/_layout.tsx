import { Tabs } from "expo-router";

export default function AdminTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="panel" options={{ title: "Panel" }} />
      <Tabs.Screen name="send" options={{ title: "Send" }} />
    </Tabs>
  );
}
