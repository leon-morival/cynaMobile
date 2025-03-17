import React from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ClientSubscription, BillingMethod } from "../../models/Entities";

export default function OrdersScreen() {
  // Mock client subscriptions data
  const clientSubscriptions: ClientSubscription[] = [
    {
      id: 1,
      billing_method: BillingMethod.ANNUAL,
      started_at: "2023-04-15T10:30:00Z",
      end_at: "2024-04-15T10:30:00Z",
      price: 99.99,
      is_active: true,
      is_renewable: true,
      user_id: 2,
      subscription_offer_id: 1,
      created_at: "2023-04-15T10:30:00Z",
      updated_at: "2023-04-15T10:30:00Z",
    },
    {
      id: 2,
      billing_method: BillingMethod.MENSUAL,
      started_at: "2023-05-20T14:45:00Z",
      end_at: "2023-06-20T14:45:00Z",
      price: 9.99,
      is_active: false,
      is_renewable: false,
      user_id: 2,
      subscription_offer_id: 2,
      created_at: "2023-05-20T14:45:00Z",
      updated_at: "2023-05-20T14:45:00Z",
    },
    {
      id: 3,
      billing_method: BillingMethod.LIFETIME,
      started_at: "2023-06-10T09:15:00Z",
      end_at: "2099-12-31T23:59:59Z",
      price: 299.99,
      is_active: true,
      is_renewable: false,
      user_id: 2,
      subscription_offer_id: 3,
      created_at: "2023-06-10T09:15:00Z",
      updated_at: "2023-06-10T09:15:00Z",
    },
  ];

  // Format date for better display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Translate billing method to French
  const getBillingMethodLabel = (method: BillingMethod) => {
    switch (method) {
      case BillingMethod.ANNUAL:
        return "Annuel";
      case BillingMethod.MENSUAL:
        return "Mensuel";
      case BillingMethod.LIFETIME:
        return "À vie";
      default:
        return method;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {clientSubscriptions.length === 0 ? (
        <Text style={styles.emptyText}>
          Vous n'avez pas encore d'abonnements
        </Text>
      ) : (
        clientSubscriptions.map((subscription) => (
          <TouchableOpacity
            key={subscription.id}
            style={styles.subscriptionCard}
          >
            <View style={styles.headerRow}>
              <Text style={styles.subscriptionId}>
                Abonnement #{subscription.id}
              </Text>
              <View
                style={[
                  styles.statusIndicator,
                  subscription.is_active
                    ? styles.activeStatus
                    : styles.inactiveStatus,
                ]}
              >
                <Text style={styles.statusText}>
                  {subscription.is_active ? "Actif" : "Inactif"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type de facturation:</Text>
                <Text style={styles.detailValue}>
                  {getBillingMethodLabel(subscription.billing_method)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date de début:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(subscription.started_at)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date de fin:</Text>
                <Text style={styles.detailValue}>
                  {subscription.billing_method === BillingMethod.LIFETIME
                    ? "Sans limite"
                    : formatDate(subscription.end_at)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Prix:</Text>
                <Text style={styles.priceValue}>
                  {subscription.price.toFixed(2)} €
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Renouvelable:</Text>
                <Text style={styles.detailValue}>
                  {subscription.is_renewable ? "Oui" : "Non"}
                </Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.viewDetailsText}>Voir les détails</Text>
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
