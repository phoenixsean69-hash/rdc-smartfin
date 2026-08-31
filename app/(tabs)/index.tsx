import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
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

const money =
  new Intl.NumberFormat(
    "en-US",
    {
      style:
        "currency",
      currency:
        "USD",
      minimumFractionDigits:
        2,
    },
  );

function dateLabel(
  value?: string,
) {
  if (!value) {
    return "—";
  }

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

export default function HomeScreen() {
  const {
    resident,
  } = useAuth();

  const {
    account,
    bills,
    payments,
    loading,
    refreshing,
    error,
    outstanding,
    refresh,
  } =
    useResidentData();

  const latestPayment =
    payments[0];

  const recentBills =
    bills.slice(0, 2);

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

        <Text>
          Loading your
          account...
        </Text>
      </View>
    );
  }

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
        <View
          style={
            styles.header
          }
        >
          <View>
            <Text
              style={
                styles.hello
              }
            >
              Hello,
              {" "}
              {
                resident?.firstName
              }
            </Text>

            <Text
              style={
                styles.headerSub
              }
            >
              {
                resident?.ward
              }
              {" • "}
              {
                resident?.propertyNumber
              }
            </Text>
          </View>

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
        </View>

        {error ? (
          <View
            style={
              styles.errorCard
            }
          >
            <Text
              style={
                styles.errorText
              }
            >
              {error}
            </Text>
          </View>
        ) : null}

        <View
          style={
            styles.balanceCard
          }
        >
          <View
            style={
              styles.balanceTop
            }
          >
            <Text
              style={
                styles.balanceLabel
              }
            >
              CURRENT BALANCE
            </Text>

            <View
              style={
                styles.statusBadge
              }
            >
              <View
                style={
                  styles.statusDot
                }
              />

              <Text
                style={
                  styles.statusText
                }
              >
                {
                  account?.status ??
                  "current"
                }
              </Text>
            </View>
          </View>

          <Text
            style={
              styles.balanceAmount
            }
          >
            {money.format(
              Number(
                account?.balance ??
                  outstanding,
              ),
            )}
          </Text>

          <Text
            style={
              styles.accountNumber
            }
          >
            Account{" "}
            {
              account?.accountNumber ??
              "—"
            }
          </Text>

          <View
            style={
              styles.balanceDivider
            }
          />

          <View
            style={
              styles.balanceStats
            }
          >
            <View>
              <Text
                style={
                  styles.statLabel
                }
              >
                Outstanding
              </Text>

              <Text
                style={
                  styles.statValue
                }
              >
                {money.format(
                  outstanding,
                )}
              </Text>
            </View>

            <View>
              <Text
                style={
                  styles.statLabel
                }
              >
                Arrears
              </Text>

              <Text
                style={
                  styles.statValue
                }
              >
                {money.format(
                  Number(
                    account?.arrears ??
                      0,
                  ),
                )}
              </Text>
            </View>

            <View>
              <Text
                style={
                  styles.statLabel
                }
              >
                Credit
              </Text>

              <Text
                style={
                  styles.statValue
                }
              >
                {money.format(
                  Number(
                    account?.credit ??
                      0,
                  ),
                )}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={
            styles.quickGrid
          }
        >
          <Pressable
            style={
              styles.quickCard
            }
            onPress={() =>
              router.push(
                "/pay",
              )
            }
          >
            <View
              style={[
                styles.quickIcon,
                {
                  backgroundColor:
                    "#EAF1FF",
                },
              ]}
            >
              <Ionicons
                name="card-outline"
                size={22}
                color="#2F6FED"
              />
            </View>

            <Text
              style={
                styles.quickTitle
              }
            >
              Pay bill
            </Text>

            <Text
              style={
                styles.quickSub
              }
            >
              Council fees
            </Text>
          </Pressable>

          <Pressable
            style={
              styles.quickCard
            }
            onPress={() =>
              router.push(
                "/bills",
              )
            }
          >
            <View
              style={[
                styles.quickIcon,
                {
                  backgroundColor:
                    "#FFF2E8",
                },
              ]}
            >
              <Ionicons
                name="receipt-outline"
                size={22}
                color="#C85E11"
              />
            </View>

            <Text
              style={
                styles.quickTitle
              }
            >
              My bills
            </Text>

            <Text
              style={
                styles.quickSub
              }
            >
              {bills.length}
              {" "}
              records
            </Text>
          </Pressable>

          <Pressable
            style={
              styles.quickCard
            }
            onPress={() =>
              router.push(
                "/activity",
              )
            }
          >
            <View
              style={[
                styles.quickIcon,
                {
                  backgroundColor:
                    "#E9F8F2",
                },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={22}
                color="#158467"
              />
            </View>

            <Text
              style={
                styles.quickTitle
              }
            >
              History
            </Text>

            <Text
              style={
                styles.quickSub
              }
            >
              {
                payments.length
              }
              {" "}
              payments
            </Text>
          </Pressable>
        </View>

        <View
          style={
            styles.sectionHeader
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Recent bills
          </Text>

          <Pressable
            onPress={() =>
              router.push(
                "/bills",
              )
            }
          >
            <Text
              style={
                styles.link
              }
            >
              See all
            </Text>
          </Pressable>
        </View>

        {recentBills.map(
          (bill) => (
            <View
              key={
                bill.$id
              }
              style={
                styles.billCard
              }
            >
              <View
                style={
                  styles.billIcon
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
                  styles.billMain
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
                    styles.billMeta
                  }
                >
                  Due{" "}
                  {dateLabel(
                    bill.dueDate,
                  )}
                </Text>
              </View>

              <View
                style={
                  styles.billRight
                }
              >
                <Text
                  style={
                    styles.billAmount
                  }
                >
                  {money.format(
                    Number(
                      bill.amount,
                    ),
                  )}
                </Text>

                <Text
                  style={[
                    styles.billStatus,
                    {
                      color:
                        bill.status ===
                        "paid"
                          ? "#158467"
                          : "#B54708",
                    },
                  ]}
                >
                  {
                    bill.status
                  }
                </Text>
              </View>
            </View>
          ),
        )}

        <View
          style={
            styles.sectionHeader
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Latest payment
          </Text>
        </View>

        {latestPayment ? (
          <View
            style={
              styles.paymentCard
            }
          >
            <View
              style={
                styles.paymentIcon
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
                styles.paymentMain
              }
            >
              <Text
                style={
                  styles.paymentTitle
                }
              >
                {
                  latestPayment.paymentMethod
                }
              </Text>

              <Text
                style={
                  styles.paymentMeta
                }
              >
                {
                  latestPayment.paymentReference
                }
                {" • "}
                {dateLabel(
                  latestPayment.paymentDate,
                )}
              </Text>
            </View>

            <Text
              style={
                styles.paymentAmount
              }
            >
              {money.format(
                Number(
                  latestPayment.amount,
                ),
              )}
            </Text>
          </View>
        ) : (
          <Text
            style={
              styles.emptyText
            }
          >
            No payments
            recorded.
          </Text>
        )}

        <View
          style={
            styles.smsCard
          }
        >
          <View
            style={
              styles.smsIcon
            }
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color="#2F6FED"
            />
          </View>

          <View
            style={
              styles.smsContent
            }
          >
            <Text
              style={
                styles.smsTitle
              }
            >
              SMS updates
            </Text>

            <Text
              style={
                styles.smsText
              }
            >
              {
                resident?.smsEnabled
                  ? "Council payment and service SMS updates are enabled."
                  : "SMS updates are currently disabled."
              }
            </Text>
          </View>
        </View>
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
      paddingBottom:
        40,
    },

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

    header: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      paddingTop: 14,
      paddingBottom: 22,
    },

    hello: {
      color: "#101828",
      fontSize: 26,
      fontWeight: "800",
      letterSpacing: -0.6,
    },

    headerSub: {
      marginTop: 4,
      color: "#667085",
      fontSize: 12,
    },

    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor:
        "#102A56",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    avatarText: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 13,
    },

    errorCard: {
      padding: 13,
      borderRadius: 14,
      backgroundColor:
        "#FEF3F2",
      marginBottom: 14,
    },

    errorText: {
      color: "#B42318",
      fontSize: 12,
    },

    balanceCard: {
      borderRadius: 25,
      padding: 22,
      backgroundColor:
        "#102A56",
    },

    balanceTop: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
    },

    balanceLabel: {
      color: "#AFC5E8",
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1,
    },

    statusBadge: {
      flexDirection:
        "row",
      alignItems:
        "center",
      backgroundColor:
        "rgba(255,255,255,0.10)",
      paddingHorizontal:
        10,
      paddingVertical: 6,
      borderRadius: 50,
      gap: 6,
    },

    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor:
        "#6CE3B4",
    },

    statusText: {
      color: "#FFFFFF",
      fontSize: 10,
      textTransform:
        "capitalize",
      fontWeight: "700",
    },

    balanceAmount: {
      color: "#FFFFFF",
      fontSize: 38,
      fontWeight: "800",
      marginTop: 20,
      letterSpacing: -1,
    },

    accountNumber: {
      color: "#B8C8E2",
      fontSize: 12,
      marginTop: 3,
    },

    balanceDivider: {
      height: 1,
      backgroundColor:
        "rgba(255,255,255,0.12)",
      marginVertical: 20,
    },

    balanceStats: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
    },

    statLabel: {
      color: "#AFC5E8",
      fontSize: 10,
    },

    statValue: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "800",
      marginTop: 5,
    },

    quickGrid: {
      flexDirection:
        "row",
      gap: 10,
      marginTop: 16,
    },

    quickCard: {
      flex: 1,
      borderRadius: 18,
      padding: 14,
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor:
        "#EAECF0",
    },

    quickIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems:
        "center",
      justifyContent:
        "center",
      marginBottom: 13,
    },

    quickTitle: {
      color: "#101828",
      fontSize: 12,
      fontWeight: "800",
    },

    quickSub: {
      color: "#98A2B3",
      fontSize: 9,
      marginTop: 3,
    },

    sectionHeader: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      marginTop: 28,
      marginBottom: 12,
    },

    sectionTitle: {
      color: "#101828",
      fontSize: 17,
      fontWeight: "800",
    },

    link: {
      color: "#2F6FED",
      fontSize: 11,
      fontWeight: "800",
    },

    billCard: {
      borderRadius: 17,
      backgroundColor:
        "#FFFFFF",
      padding: 15,
      borderWidth: 1,
      borderColor:
        "#EAECF0",
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 9,
    },

    billIcon: {
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

    billMain: {
      flex: 1,
      marginLeft: 12,
    },

    billTitle: {
      color: "#101828",
      fontSize: 12,
      fontWeight: "700",
    },

    billMeta: {
      color: "#98A2B3",
      fontSize: 9,
      marginTop: 5,
    },

    billRight: {
      alignItems:
        "flex-end",
      marginLeft: 8,
    },

    billAmount: {
      color: "#101828",
      fontSize: 13,
      fontWeight: "800",
    },

    billStatus: {
      fontSize: 9,
      fontWeight: "800",
      textTransform:
        "capitalize",
      marginTop: 4,
    },

    paymentCard: {
      padding: 16,
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor:
        "#EAECF0",
      borderRadius: 17,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    paymentIcon: {
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

    paymentMain: {
      flex: 1,
      marginLeft: 12,
    },

    paymentTitle: {
      color: "#101828",
      fontSize: 12,
      fontWeight: "800",
    },

    paymentMeta: {
      color: "#98A2B3",
      fontSize: 9,
      marginTop: 4,
    },

    paymentAmount: {
      color: "#158467",
      fontSize: 14,
      fontWeight: "800",
    },

    emptyText: {
      color: "#98A2B3",
      fontSize: 12,
    },

    smsCard: {
      marginTop: 24,
      backgroundColor:
        "#EAF1FF",
      padding: 17,
      borderRadius: 18,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    smsIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor:
        "#FFFFFF",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    smsContent: {
      flex: 1,
      marginLeft: 12,
    },

    smsTitle: {
      color: "#183B72",
      fontSize: 12,
      fontWeight: "800",
    },

    smsText: {
      color: "#58719A",
      fontSize: 10,
      lineHeight: 15,
      marginTop: 3,
    },
  });
