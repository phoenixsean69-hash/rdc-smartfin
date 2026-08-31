import {
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

export default function PayScreen() {
  const {
    bills,
    outstanding,
  } =
    useResidentData();

  const unpaidBills =
    bills.filter(
      (bill) =>
        Number(
          bill.balanceDue,
        ) > 0,
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
      >
        <Text
          style={
            styles.eyebrow
          }
        >
          PAYMENTS
        </Text>

        <Text
          style={
            styles.title
          }
        >
          Pay council
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          Settle outstanding
          rates and service
          charges.
        </Text>

        <View
          style={
            styles.amountCard
          }
        >
          <Text
            style={
              styles.amountLabel
            }
          >
            TOTAL DUE
          </Text>

          <Text
            style={
              styles.amount
            }
          >
            {money.format(
              outstanding,
            )}
          </Text>
        </View>

        {unpaidBills.length ===
        0 ? (
          <View
            style={
              styles.clearCard
            }
          >
            <View
              style={
                styles.clearIcon
              }
            >
              <Ionicons
                name="checkmark"
                size={30}
                color="#158467"
              />
            </View>

            <Text
              style={
                styles.clearTitle
              }
            >
              You are all
              caught up
            </Text>

            <Text
              style={
                styles.clearText
              }
            >
              There are no
              outstanding bills
              on your SmartPay
              account.
            </Text>
          </View>
        ) : (
          <>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Bills to pay
            </Text>

            {unpaidBills.map(
              (bill) => (
                <View
                  key={
                    bill.$id
                  }
                  style={
                    styles.billCard
                  }
                >
                  <View>
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
                        styles.billRef
                      }
                    >
                      {
                        bill.billNumber
                      }
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.billAmount
                    }
                  >
                    {money.format(
                      Number(
                        bill.balanceDue,
                      ),
                    )}
                  </Text>
                </View>
              ),
            )}
          </>
        )}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Payment methods
        </Text>

        <View
          style={
            styles.method
          }
        >
          <View
            style={
              styles.methodIcon
            }
          >
            <Ionicons
              name="phone-portrait-outline"
              size={23}
              color="#2F6FED"
            />
          </View>

          <View
            style={
              styles.methodMain
            }
          >
            <Text
              style={
                styles.methodTitle
              }
            >
              EcoCash
            </Text>

            <Text
              style={
                styles.methodText
              }
            >
              Mobile money
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={19}
            color="#98A2B3"
          />
        </View>

        <View
          style={
            styles.method
          }
        >
          <View
            style={
              styles.methodIcon
            }
          >
            <Ionicons
              name="business-outline"
              size={23}
              color="#2F6FED"
            />
          </View>

          <View
            style={
              styles.methodMain
            }
          >
            <Text
              style={
                styles.methodTitle
              }
            >
              Council office
            </Text>

            <Text
              style={
                styles.methodText
              }
            >
              Cash payment
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={19}
            color="#98A2B3"
          />
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

    amountCard: {
      backgroundColor:
        "#102A56",
      borderRadius: 22,
      padding: 22,
      marginTop: 24,
    },

    amountLabel: {
      color: "#AFC5E8",
      fontSize: 10,
      fontWeight: "800",
    },

    amount: {
      color: "#FFFFFF",
      fontSize: 36,
      fontWeight: "800",
      marginTop: 8,
    },

    clearCard: {
      marginTop: 18,
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor:
        "#DDEFE8",
      borderRadius: 20,
      padding: 25,
      alignItems:
        "center",
    },

    clearIcon: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor:
        "#E9F8F2",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    clearTitle: {
      color: "#101828",
      fontSize: 17,
      fontWeight: "800",
      marginTop: 14,
    },

    clearText: {
      color: "#667085",
      fontSize: 11,
      lineHeight: 17,
      textAlign: "center",
      marginTop: 6,
      maxWidth: 250,
    },

    sectionTitle: {
      color: "#101828",
      fontSize: 16,
      fontWeight: "800",
      marginTop: 28,
      marginBottom: 12,
    },

    billCard: {
      padding: 16,
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor:
        "#EAECF0",
      borderRadius: 17,
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      marginBottom: 9,
    },

    billTitle: {
      color: "#101828",
      fontSize: 12,
      fontWeight: "800",
    },

    billRef: {
      color: "#98A2B3",
      fontSize: 9,
      marginTop: 4,
    },

    billAmount: {
      color: "#B54708",
      fontSize: 14,
      fontWeight: "800",
    },

    method: {
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor:
        "#EAECF0",
      borderRadius: 17,
      padding: 15,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 9,
    },

    methodIcon: {
      width: 43,
      height: 43,
      borderRadius: 13,
      backgroundColor:
        "#EAF1FF",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    methodMain: {
      flex: 1,
      marginLeft: 12,
    },

    methodTitle: {
      color: "#101828",
      fontSize: 12,
      fontWeight: "800",
    },

    methodText: {
      color: "#98A2B3",
      fontSize: 9,
      marginTop: 4,
    },
  });
