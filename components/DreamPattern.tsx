import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Hash } from "lucide-react-native";

interface DreamPatternProps {
  themes: Array<{ tag: string; count: number }>;
}

export default function DreamPattern({ themes }: DreamPatternProps) {
  if (themes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Pas encore de thèmes récurrents identifiés
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {themes.map((theme, index) => (
        <View key={theme.tag} style={styles.themeItem}>
          <View style={styles.themeHeader}>
            <View style={styles.themeTag}>
              <Hash color="#9333EA" size={14} />
              <Text style={styles.themeText}>{theme.tag}</Text>
            </View>
            <Text style={styles.themeCount}>{theme.count}x</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(theme.count / themes[0].count) * 100}%` }
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(148, 163, 184, 0.05)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  emptyContainer: {
    backgroundColor: "rgba(148, 163, 184, 0.05)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
  },
  themeItem: {
    marginBottom: 16,
  },
  themeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  themeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  themeText: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "500",
  },
  themeCount: {
    color: "#9333EA",
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(148, 163, 184, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#9333EA",
    borderRadius: 2,
  },
});