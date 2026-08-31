import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Redirect,
} from "expo-router";

import {
  useAuth,
} from "../src/context/AuthContext";

export default function IndexScreen() {
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
        <View
          style={
            styles.logo
          }
        >
          <Text
            style={
              styles.logoText
            }
          >
            S
          </Text>
        </View>

        <ActivityIndicator
          size="small"
          color="#2F6FED"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Loading SmartPay
        </Text>
      </View>
    );
  }

  if (
    user &&
    resident
  ) {
    return (
      <Redirect
        href="/(tabs)"
      />
    );
  }

  return (
    <Redirect
      href="/login"
    />
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
      gap: 16,
      backgroundColor:
        "#F5F7FB",
    },

    logo: {
      width: 62,
      height: 62,
      borderRadius: 20,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        "#102A56",
    },

    logoText: {
      color: "#FFFFFF",
      fontSize: 30,
      fontWeight: "800",
    },

    loadingText: {
      color: "#667085",
      fontSize: 14,
    },
  });
