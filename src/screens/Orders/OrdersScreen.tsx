import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { getUserSubscriptions } from "../../../services/subscriptionService";
import { useTranslate } from "../../utils/translationUtils";

export default function OrdersScreen() {
  const { token } = useContext(AuthContext);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const translate = useTranslate();

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getUserSubscriptions(token)
      .then((subs) => setSubscriptions(subs))
      .catch(() => setSubscriptions([]))
      .finally(() => setLoading(false));
  }, [token]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getBillingMethodLabel = (type: string) => {
    switch (type) {
      case "annual":
        return translate("billing_annual");
      case "mensual":
        return translate("billing_monthly");
      case "lifetime":
        return translate("billing_lifetime");
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {subscriptions.length === 0 ? (
        <Text style={styles.emptyText}>{translate("no_subscriptions")}</Text>
      ) : (
        subscriptions.map((subscription) => (
          <TouchableOpacity
            key={subscription.id}
            style={styles.subscriptionCard}
          >
            <View style={styles.headerRow}>
              <Text style={styles.subscriptionId}>
                {translate("subscription_number").replace(
                  "{{id}}",
                  subscription.id
                )}
              </Text>
              <View
                style={[
                  styles.statusIndicator,
                  subscription.status === "active"
                    ? styles.activeStatus
                    : styles.inactiveStatus,
                ]}
              >
                <Text style={styles.statusText}>
                  {subscription.status === "active"
                    ? translate("subscription_active")
                    : translate("subscription_inactive")}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {translate("billing_type_label")}
                </Text>
                <Text style={styles.detailValue}>
                  {getBillingMethodLabel(subscription.subscription_type)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {translate("start_date_label")}
                </Text>
                <Text style={styles.detailValue}>
                  {formatDate(subscription.start_date)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {translate("end_date_label")}
                </Text>
                <Text style={styles.detailValue}>
                  {subscription.subscription_type === "lifetime"
                    ? translate("no_limit")
                    : formatDate(subscription.end_date)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {translate("license_label")}
                </Text>
                <Text style={styles.detailValue}>
                  {subscription.licence_key || "-"}
                </Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.viewDetailsText}>
                {translate("see_invoices")}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  subscriptionCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subscriptionId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeStatus: {
    backgroundColor: "#e6f7ed",
  },
  inactiveStatus: {
    backgroundColor: "#ffe6e6",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: "#666",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  priceValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  footer: {
    alignItems: "flex-end",
  },
  viewDetailsText: {
    color: "#0066cc",
    fontSize: 14,
  },
});
