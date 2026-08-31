import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useResidentData,
} from "../../src/context/ResidentDataContext";

const money =
  new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    },
  );

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(value),
  );
}

export default function ActivityScreen() {
  const {
    payments,
    refreshing,
    refresh,
  } =
    useResidentData();

  const totalPaid =
    payments.reduce(
      (
        total,
        payment,
      ) =>
        total +
        Number(
          payment.amount,
        ),
      0,
    );

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
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              refresh
            }
          />
        }
      >
        <Text
          style={
            styles.eyebrow
          }
        >
          ACCOUNT ACTIVITY
        </Text>

        <Text
          style={
            styles.title
          }
        >
          Payments
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          Confirmed SmartPay
          payment history.
        </Text>

        <View
          style={
            styles.summary
          }
        >
          <Text
            style={
              styles.summaryLabel
            }
          >
            TOTAL RECORDED
          </Text>

          <Text
            style={
              styles.summaryAmount
            }
          >
            {money.format(
              totalPaid,
            )}
          </Text>

          <Text
            style={
              styles.summaryMeta
            }
          >
            {
              payments.length
            }
            {" "}
            completed
            payments
          </Text>
        </View>

        <Text
          style={
            styles.sectionTitle
          }
        >
          Payment history
        </Text>

        {payments.map(
          (payment) => (
            <View
              key={
                payment.$id
              }
              style={
                styles.card
              }
            >
              <View
                style={
                  styles.icon
                }
              >
                <Ionicons
                  name="checkmark"
                  size={22}
                  color="#158467"
                />
              </View>

              <View
                style={
                  styles.main
                }
              >
                <Text
                  style={
                    styles.method
                  }
                >
                  {
                    payment.paymentMethod
                  }
                </Text>

                <Text
                  style={
                    styles.reference
                  }
                >
                  {
                    payment.paymentReference
                  }
                </Text>

                <Text
                  style={
                    styles.date
                  }
                >
                  {formatDate(
                    payment.paymentDate,
                  )}
                  {" • "}
                  {
                    payment.channel
                  }
                </Text>
              </View>

              <View
                style={
                  styles.right
                }
              >
                <Text
                  style={
                    styles.amount
                  }
                >
                  {money.format(
                    Number(
                      payment.amount,
                    ),
                  )}
                </Text>

                <Text
                  style={
                    styles.status
                  }
                >
                  {
                    payment.status
                  }
                </Text>
              </View>
            </View>
          ),
        )}
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

    subtitle: {
      color: "#667085",
      fontSize: 13,
      marginTop: 7,
    },

    summary: {
      backgroundColor:
        "#102A56",
      borderRadius: 22,
      padding: 21,
      marginTop: 24,
    },

    summaryLabel: {
      color: "#AFC5E8",
      fontSize: 10,
      fontWeight: "800",
    },

    summaryAmount: {
      color: "#FFFFFF",
      fontSize: 32,
      fontWeight: "800",
      marginTop: 7,
    },

    summaryMeta: {
      color: "#AFC5E8",
      fontSize: 10,
      marginTop: 4,
    },

    sectionTitle: {
      color: "#101828",
      fontSize: 16,
      fontWeight: "800",
      marginTop: 28,
      marginBottom: 12,
    },

    card: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 17,
      borderWidth: 1,
      borderColor:
        "#EAECF0",
      padding: 15,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 9,
    },

    icon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor:
        "#E9F8F2",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    main: {
      flex: 1,
      marginLeft: 12,
    },

    method: {
      color: "#101828",
      fontSize: 12,
      fontWeight: "800",
    },

    reference: {
      color: "#667085",
      fontSize: 9,
      marginTop: 3,
    },

    date: {
      color: "#98A2B3",
      fontSize: 8,
      marginTop: 4,
    },

    right: {
      alignItems:
        "flex-end",
    },

    amount: {
      color: "#101828",
      fontSize: 14,
      fontWeight: "800",
    },

    status: {
      color: "#158467",
      fontSize: 8,
      fontWeight: "800",
      textTransform:
        "capitalize",
      marginTop: 4,
    },
  });
