import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTranslate } from "../../utils/translationUtils";
import { getSubscriptionInvoices } from "../../../services/subscriptionService";
import { Colors } from "../../../constants/Colors";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";
export default function InvoiceScreen() {
  const route = useRoute<any>();
  const { subscriptionId } = route.params;
  const translate = useTranslate();
  const { token } = useContext(AuthContext);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getSubscriptionInvoices(subscriptionId, token)
      .then(setInvoices)
      .finally(() => setLoading(false));
  }, [subscriptionId, token]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (!invoices.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>{translate("no_invoices")}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{translate("invoices_for_subscription")}</Text>
      {invoices.map(
        (item) => (
          console.log(item.period_start, item.period_end),
          (
            <View key={item.id} style={styles.invoiceBox}>
              <Text style={styles.label}>
                {translate("invoice_number")} :
                <Text style={styles.value}>{" " + item.number}</Text>
              </Text>
              <Text style={styles.label}>
                {translate("amount")} :
                <Text style={styles.value}>{" " + item.ttc_amount} €</Text>
              </Text>
              <Text style={styles.label}>
                {translate("period")} :
                <Text style={styles.value}>
                  {moment(item.period_start).format("DD/MM/YYYY")} -{" "}
                  {moment(item.period_end).format("DD/MM/YYYY")}
                </Text>
              </Text>
            </View>
          )
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.primary,
    textAlign: "center",
  },
  invoiceBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  label: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  value: { fontWeight: "normal", color: Colors.primary },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: Colors.primary, fontSize: 18 },
});
