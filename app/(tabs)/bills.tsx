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

export default function BillsScreen() {
  const {
    bills,
    outstanding,
    refreshing,
    refresh,
  } =
    useResidentData();

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
        showsVerticalScrollIndicator={
          false
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
          COUNCIL CHARGES
        </Text>

        <Text
          style={
            styles.title
          }
        >
          My bills
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          Your council billing
          history and current
          balances.
        </Text>

        <View
          style={
            styles.summary
          }
        >
          <View>
            <Text
              style={
                styles.summaryLabel
              }
            >
              Outstanding
            </Text>

            <Text
              style={
                styles.summaryAmount
              }
            >
              {money.format(
                outstanding,
              )}
            </Text>
          </View>

          <View
            style={
              styles.summaryIcon
            }
          >
            <Ionicons
              name="receipt-outline"
              size={25}
              color="#FFFFFF"
            />
          </View>
        </View>

        <Text
          style={
            styles.sectionTitle
          }
        >
          All bills
        </Text>

        {bills.map(
          (bill) => {
            const paid =
              bill.status ===
              "paid";

            return (
              <View
                key={
                  bill.$id
                }
                style={
                  styles.card
                }
              >
                <View
                  style={
                    styles.cardTop
                  }
                >
                  <View
                    style={
                      styles.icon
                    }
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={21}
                      color="#2F6FED"
                    />
                  </View>

                  <View
                    style={
                      styles.main
                    }
                  >
                    <Text
                      style={
                        styles.billTitle
                      }
                    >
                      {
                        bill.description ??
                        bill.billNumber
                      }
                    </Text>

                    <Text
                      style={
                        styles.billNumber
                      }
                    >
                      {
                        bill.billNumber
                      }
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.status,
                      paid
                        ? styles.statusPaid
                        : styles.statusDue,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        paid
                          ? styles.statusPaidText
                          : styles.statusDueText,
                      ]}
                    >
                      {
                        bill.status
                      }
                    </Text>
                  </View>
                </View>

                <View
                  style={
                    styles.line
                  }
                />

                <View
                  style={
                    styles.details
                  }
                >
                  <View>
                    <Text
                      style={
                        styles.detailLabel
                      }
                    >
                      Bill amount
                    </Text>

                    <Text
                      style={
                        styles.detailValue
                      }
                    >
                      {money.format(
                        Number(
                          bill.amount,
                        ),
                      )}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={
                        styles.detailLabel
                      }
                    >
                      Paid
                    </Text>

                    <Text
                      style={
                        styles.detailValue
                      }
                    >
                      {money.format(
                        Number(
                          bill.amountPaid,
                        ),
                      )}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={
                        styles.detailLabel
                      }
                    >
                      Balance
                    </Text>

                    <Text
                      style={
                        styles.detailValue
                      }
                    >
                      {money.format(
                        Number(
                          bill.balanceDue,
                        ),
                      )}
                    </Text>
                  </View>
                </View>

                <Text
                  style={
                    styles.dueDate
                  }
                >
                  Due{" "}
                  {formatDate(
                    bill.dueDate,
                  )}
                </Text>
              </View>
            );
          },
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
      letterSpacing: -0.7,
      marginTop: 7,
    },

    subtitle: {
      color: "#667085",
      fontSize: 13,
      lineHeight: 19,
      marginTop: 7,
    },

    summary: {
      marginTop: 23,
      borderRadius: 21,
      padding: 20,
      backgroundColor:
        "#102A56",
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
    },

    summaryLabel: {
      color: "#AFC5E8",
      fontSize: 10,
      fontWeight: "700",
    },

    summaryAmount: {
      color: "#FFFFFF",
      fontSize: 30,
      fontWeight: "800",
      marginTop: 6,
    },

    summaryIcon: {
      width: 50,
      height: 50,
      borderRadius: 17,
      backgroundColor:
        "rgba(255,255,255,0.10)",
      alignItems:
        "center",
      justifyContent:
        "center",
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
      borderRadius: 18,
      borderWidth: 1,
      borderColor:
        "#EAECF0",
      padding: 16,
      marginBottom: 11,
    },

    cardTop: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    icon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor:
        "#EAF1FF",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    main: {
      flex: 1,
      marginLeft: 12,
    },

    billTitle: {
      color: "#101828",
      fontSize: 12,
      fontWeight: "800",
    },

    billNumber: {
      color: "#98A2B3",
      fontSize: 9,
      marginTop: 4,
    },

    status: {
      paddingHorizontal:
        9,
      paddingVertical: 6,
      borderRadius: 40,
    },

    statusPaid: {
      backgroundColor:
        "#E9F8F2",
    },

    statusDue: {
      backgroundColor:
        "#FFF4E8",
    },

    statusText: {
      fontSize: 9,
      fontWeight: "800",
      textTransform:
        "capitalize",
    },

    statusPaidText: {
      color: "#158467",
    },

    statusDueText: {
      color: "#B54708",
    },

    line: {
      height: 1,
      backgroundColor:
        "#F0F1F3",
      marginVertical: 15,
    },

    details: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
    },

    detailLabel: {
      color: "#98A2B3",
      fontSize: 9,
    },

    detailValue: {
      color: "#344054",
      fontSize: 12,
      fontWeight: "800",
      marginTop: 4,
    },

    dueDate: {
      color: "#667085",
      fontSize: 9,
      marginTop: 15,
    },
  });
