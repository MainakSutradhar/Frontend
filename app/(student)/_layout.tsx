import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function StudentTabs() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2ECC71",

        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "home") {
            iconName = "home-outline";
          } else if (route.name === "event_details") {
            iconName = "calendar-outline";
          } else if (route.name === "qrscan") {
            iconName = "qr-code-outline";
          } else if (route.name === "redeem") {
            iconName = "gift-outline";
          } else if (route.name === "profile") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />

      <Tabs.Screen
        name="event_details"
        options={{ title: "Events" }}
      />

      <Tabs.Screen
        name="qrscan"
        options={{ title: "Scan" }}
      />

      <Tabs.Screen
        name="redeem"
        options={{ title: "Redeem" }}
      />

      <Tabs.Screen
        name="profile"
        options={{ title: "Profile" }}
      />
    </Tabs>
  );
}