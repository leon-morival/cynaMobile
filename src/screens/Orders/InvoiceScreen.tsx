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
import { STORAGE_URL } from "../../../constants/api";
import moment from "moment";
import Pdf from "react-native-pdf";

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
  console.log("Invoices loaded:", invoices);
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
  console.log("Invoices:", JSON.stringify(invoices, null, 2));
  // On prend le premier invoice (ou adapte selon besoin)
  const invoice = invoices[0];

  const pdfUrl = STORAGE_URL + invoice.pdf_url;
  console.log("PDF URL:", pdfUrl);
  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <Text style={styles.title}>{translate("invoices_for_subscription")}</Text>
      <Pdf
        trustAllCerts={false}
        source={{ uri: pdfUrl, cache: true }}
        style={{ flex: 1, marginVertical: 10 }}
        onError={(error) => {
          console.log(error);
        }}
        renderActivityIndicator={() => (
          <ActivityIndicator color={Colors.primary} size="large" />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
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
