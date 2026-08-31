import {
  useState,
} from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useAuth,
} from "../src/context/AuthContext";

export default function LoginScreen() {
  const {
    login,
    loading,
    error,
  } = useAuth();

  const [
    email,
    setEmail,
  ] =
    useState(
      "tapiwa.moyo@smartpay.local",
    );

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const handleLogin =
    async () => {
      if (
        !email.trim() ||
        !password
      ) {
        return;
      }

      try {
        await login(
          email,
          password,
        );

        router.replace("/");
      } catch {
        // Error displayed
        // from AuthContext.
      }
    };

  return (
    <SafeAreaView
      style={
        styles.safe
      }
    >
      <KeyboardAvoidingView
        style={
          styles.keyboard
        }
        behavior={
          Platform.OS ===
          "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={
              styles.brandRow
            }
          >
            <View
              style={
                styles.brandMark
              }
            >
              <Text
                style={
                  styles.brandLetter
                }
              >
                S
              </Text>
            </View>

            <View>
              <Text
                style={
                  styles.brandName
                }
              >
                SmartPay
              </Text>

              <Text
                style={
                  styles.brandSub
                }
              >
                Resident
              </Text>
            </View>
          </View>

          <View
            style={
              styles.hero
            }
          >
            <Text
              style={
                styles.eyebrow
              }
            >
              YOUR COUNCIL ACCOUNT
            </Text>

            <Text
              style={
                styles.title
              }
            >
              Welcome back
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              View council bills,
              balances and your
              payment history in
              one place.
            </Text>
          </View>

          <View
            style={
              styles.form
            }
          >
            <Text
              style={
                styles.label
              }
            >
              Email
            </Text>

            <View
              style={
                styles.inputBox
              }
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color="#667085"
              />

              <TextInput
                value={
                  email
                }
                onChangeText={
                  setEmail
                }
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Email address"
                placeholderTextColor="#98A2B3"
                style={
                  styles.input
                }
              />
            </View>

            <Text
              style={[
                styles.label,
                styles.passwordLabel,
              ]}
            >
              Password
            </Text>

            <View
              style={
                styles.inputBox
              }
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#667085"
              />

              <TextInput
                value={
                  password
                }
                onChangeText={
                  setPassword
                }
                placeholder="Password"
                placeholderTextColor="#98A2B3"
                secureTextEntry={
                  !showPassword
                }
                style={
                  styles.input
                }
              />

              <Pressable
                onPress={() =>
                  setShowPassword(
                    (current) =>
                      !current,
                  )
                }
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={21}
                  color="#667085"
                />
              </Pressable>
            </View>

            {error ? (
              <View
                style={
                  styles.errorBox
                }
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="#B42318"
                />

                <Text
                  style={
                    styles.errorText
                  }
                >
                  {error}
                </Text>
              </View>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed &&
                  styles.loginButtonPressed,
                loading &&
                  styles.loginButtonDisabled,
              ]}
              disabled={
                loading
              }
              onPress={
                handleLogin
              }
            >
              {loading ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Text
                    style={
                      styles.loginText
                    }
                  >
                    Sign in
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={19}
                    color="#FFFFFF"
                  />
                </>
              )}
            </Pressable>

            <View
              style={
                styles.demoCard
              }
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#2F6FED"
              />

              <View
                style={
                  styles.demoContent
                }
              >
                <Text
                  style={
                    styles.demoTitle
                  }
                >
                  Demo resident
                </Text>

                <Text
                  style={
                    styles.demoText
                  }
                >
                  Tapiwa Moyo •
                  Ward 1 •
                  SP-000001
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor:
        "#F5F7FB",
    },

    keyboard: {
      flex: 1,
    },

    content: {
      flexGrow: 1,
      paddingHorizontal:
        24,
      paddingTop: 28,
      paddingBottom:
        32,
    },

    brandRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 12,
    },

    brandMark: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor:
        "#102A56",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    brandLetter: {
      color: "#FFFFFF",
      fontSize: 22,
      fontWeight: "800",
    },

    brandName: {
      color: "#101828",
      fontSize: 18,
      fontWeight: "800",
    },

    brandSub: {
      color: "#667085",
      fontSize: 12,
      marginTop: 1,
    },

    hero: {
      marginTop: 64,
      marginBottom: 38,
    },

    eyebrow: {
      color: "#2F6FED",
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 1.2,
      marginBottom: 12,
    },

    title: {
      color: "#101828",
      fontSize: 36,
      lineHeight: 42,
      fontWeight: "800",
      letterSpacing: -1,
    },

    subtitle: {
      color: "#667085",
      marginTop: 13,
      maxWidth: 320,
      fontSize: 15,
      lineHeight: 23,
    },

    form: {
      marginTop: 4,
    },

    label: {
      color: "#344054",
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 8,
    },

    passwordLabel: {
      marginTop: 19,
    },

    inputBox: {
      height: 58,
      borderWidth: 1,
      borderColor:
        "#D0D5DD",
      borderRadius: 16,
      backgroundColor:
        "#FFFFFF",
      flexDirection:
        "row",
      alignItems:
        "center",
      paddingHorizontal:
        16,
      gap: 11,
    },

    input: {
      flex: 1,
      color: "#101828",
      fontSize: 15,
      height: "100%",
    },

    errorBox: {
      flexDirection:
        "row",
      alignItems:
        "flex-start",
      gap: 8,
      padding: 12,
      borderRadius: 12,
      backgroundColor:
        "#FEF3F2",
      marginTop: 16,
    },

    errorText: {
      flex: 1,
      color: "#B42318",
      fontSize: 12,
      lineHeight: 18,
    },

    loginButton: {
      height: 58,
      borderRadius: 17,
      marginTop: 24,
      backgroundColor:
        "#2F6FED",
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 9,
    },

    loginButtonPressed: {
      opacity: 0.88,
    },

    loginButtonDisabled: {
      opacity: 0.6,
    },

    loginText: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 15,
    },

    demoCard: {
      marginTop: 22,
      borderRadius: 16,
      padding: 16,
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 12,
      backgroundColor:
        "#EAF1FF",
    },

    demoContent: {
      flex: 1,
    },

    demoTitle: {
      color: "#183B72",
      fontWeight: "800",
      fontSize: 12,
    },

    demoText: {
      color: "#45628E",
      fontSize: 11,
      marginTop: 3,
    },
  });
