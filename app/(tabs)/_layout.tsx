import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Redirect,
  Tabs,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useAuth,
} from "../../src/context/AuthContext";

import {
  ResidentDataProvider,
} from "../../src/context/ResidentDataContext";

export default function TabsLayout() {
  const {
    user,
    resident,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <View
        style={
          styles.loading
        }
      >
        <ActivityIndicator
          color="#2F6FED"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Loading account...
        </Text>
      </View>
    );
  }

  if (
    !user ||
    !resident
  ) {
    return (
      <Redirect
        href="/login"
      />
    );
  }

  return (
    <ResidentDataProvider>
      <Tabs
        screenOptions={{
          headerShown:
            false,

          tabBarActiveTintColor:
            "#2F6FED",

          tabBarInactiveTintColor:
            "#98A2B3",

          tabBarStyle: {
            height: 72,
            paddingTop: 8,
            paddingBottom: 9,
            borderTopWidth: 1,
            borderTopColor:
              "#EAECF0",
            backgroundColor:
              "#FFFFFF",
          },

          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "700",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({
              color,
              size,
            }) => (
              <Ionicons
                name="home-outline"
                color={
                  color
                }
                size={
                  size
                }
              />
            ),
          }}
        />

        <Tabs.Screen
          name="bills"
          options={{
            title: "Bills",
            tabBarIcon: ({
              color,
              size,
            }) => (
              <Ionicons
                name="receipt-outline"
                color={
                  color
                }
                size={
                  size
                }
              />
            ),
          }}
        />

        <Tabs.Screen
          name="pay"
          options={{
            title: "Pay",
            tabBarIcon: ({
              color,
              size,
            }) => (
              <Ionicons
                name="card-outline"
                color={
                  color
                }
                size={
                  size
                }
              />
            ),
          }}
        />

        <Tabs.Screen
          name="activity"
          options={{
            title:
              "Activity",

            tabBarIcon: ({
              color,
              size,
            }) => (
              <Ionicons
                name="time-outline"
                color={
                  color
                }
                size={
                  size
                }
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title:
              "Profile",

            tabBarIcon: ({
              color,
              size,
            }) => (
              <Ionicons
                name="person-outline"
                color={
                  color
                }
                size={
                  size
                }
              />
            ),
          }}
        />
      </Tabs>
    </ResidentDataProvider>
  );
}

const styles =
  StyleSheet.create({
    loading: {
      flex: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 12,
      backgroundColor:
        "#F5F7FB",
    },

    loadingText: {
      color: "#667085",
      fontSize: 13,
    },
  });
