import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
} from "../../src/context/AuthContext";

import {
  useResidentData,
} from "../../src/context/ResidentDataContext";

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View
      style={
        styles.row
      }
    >
      <View
        style={
          styles.rowIcon
        }
      >
        <Ionicons
          name={icon}
          size={19}
          color="#2F6FED"
        />
      </View>

      <View
        style={
          styles.rowMain
        }
      >
        <Text
          style={
            styles.rowLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.rowValue
          }
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const {
    resident,
    logout,
  } = useAuth();

  const {
    account,
  } =
    useResidentData();

  const handleLogout =
    async () => {
      await logout();

      router.replace(
        "/login",
      );
    };

  return (
    <SafeAreaView
      style={
        styles.safe
      }
      edges={[
        "top",
      ]}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
      >
        <Text
          style={
            styles.eyebrow
          }
        >
          SMARTPAY PROFILE
        </Text>

        <Text
          style={
            styles.title
          }
        >
          My account
        </Text>

        <View
          style={
            styles.identityCard
          }
        >
          <View
            style={
              styles.avatar
            }
          >
            <Text
              style={
                styles.avatarText
              }
            >
              {
                resident?.firstName?.[
                  0
                ]
              }
              {
                resident?.lastName?.[
                  0
                ]
              }
            </Text>
          </View>

          <Text
            style={
              styles.name
            }
          >
            {
              resident?.firstName
            }
            {" "}
            {
              resident?.lastName
            }
          </Text>

          <Text
            style={
              styles.accountNumber
            }
          >
            {
              account?.accountNumber ??
              "SmartPay resident"
            }
          </Text>

          <View
            style={
              styles.activeBadge
            }
          >
            <View
              style={
                styles.activeDot
              }
            />

            <Text
              style={
                styles.activeText
              }
            >
              Active resident
            </Text>
          </View>
        </View>

        <Text
          style={
            styles.sectionTitle
          }
        >
          Resident details
        </Text>

        <View
          style={
            styles.detailsCard
          }
        >
          <ProfileRow
            icon="call-outline"
            label="Phone"
            value={
              resident?.phone ??
              "—"
            }
          />

          <ProfileRow
            icon="mail-outline"
            label="Email"
            value={
              resident?.email ??
              "—"
            }
          />

          <ProfileRow
            icon="location-outline"
            label="Address"
            value={
              resident?.address ??
              "—"
            }
          />

          <ProfileRow
            icon="map-outline"
            label="Ward"
            value={
              resident?.ward ??
              "—"
            }
          />

          <ProfileRow
            icon="home-outline"
            label="Property number"
            value={
              resident?.propertyNumber ??
              "—"
            }
          />

          <ProfileRow
            icon="chatbubble-outline"
            label="SMS alerts"
            value={
              resident?.smsEnabled
                ? "Enabled"
                : "Disabled"
            }
          />
        </View>

        <Pressable
          style={
            styles.logout
          }
          onPress={
            handleLogout
          }
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#B42318"
          />

          <Text
            style={
              styles.logoutText
            }
          >
            Sign out
          </Text>
        </Pressable>
      </ScrollView>
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

    content: {
      paddingHorizontal:
        20,
      paddingTop: 22,
      paddingBottom:
        40,
    },

    eyebrow: {
      color: "#2F6FED",
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1,
    },

    title: {
      color: "#101828",
      fontSize: 30,
      fontWeight: "800",
      marginTop: 7,
    },

    identityCard: {
      marginTop: 23,
      backgroundColor:
        "#102A56",
      borderRadius: 22,
      padding: 24,
      alignItems:
        "center",
    },

    avatar: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor:
        "#FFFFFF",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    avatarText: {
      color: "#102A56",
      fontSize: 24,
      fontWeight: "800",
    },

    name: {
      color: "#FFFFFF",
      fontSize: 19,
      fontWeight: "800",
      marginTop: 13,
    },

    accountNumber: {
      color: "#AFC5E8",
      fontSize: 11,
      marginTop: 4,
    },

    activeBadge: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 6,
      marginTop: 14,
      paddingHorizontal:
        10,
      paddingVertical: 6,
      borderRadius: 30,
      backgroundColor:
        "rgba(255,255,255,0.10)",
    },

    activeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor:
        "#6CE3B4",
    },

    activeText: {
      color: "#FFFFFF",
      fontSize: 9,
      fontWeight: "700",
    },

    sectionTitle: {
      color: "#101828",
      fontSize: 16,
      fontWeight: "800",
      marginTop: 28,
      marginBottom: 12,
    },

    detailsCard: {
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor:
        "#EAECF0",
      borderRadius: 18,
      paddingHorizontal:
        15,
    },

    row: {
      flexDirection:
        "row",
      alignItems:
        "center",
      paddingVertical: 14,
      borderBottomWidth:
        StyleSheet.hairlineWidth,
      borderBottomColor:
        "#EAECF0",
    },

    rowIcon: {
      width: 37,
      height: 37,
      borderRadius: 12,
      backgroundColor:
        "#EAF1FF",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    rowMain: {
      flex: 1,
      marginLeft: 12,
    },

    rowLabel: {
      color: "#98A2B3",
      fontSize: 9,
    },

    rowValue: {
      color: "#344054",
      fontSize: 11,
      fontWeight: "700",
      marginTop: 3,
    },

    logout: {
      marginTop: 22,
      height: 54,
      borderRadius: 16,
      backgroundColor:
        "#FEF3F2",
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 8,
    },

    logoutText: {
      color: "#B42318",
      fontWeight: "800",
      fontSize: 12,
    },
  });
