import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Moon } from "lucide-react-native";

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "Aucun rêve enregistré" }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Moon color="#64748B" size={48} />
      </View>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.subtitle}>
        Commencez à enregistrer vos rêves pour les voir apparaître ici
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E2E8F0",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
});