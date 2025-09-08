import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LucideIcon } from "lucide-react-native";

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  total?: number;
  label?: string;
  color: string;
  gradient: string[];
}

export default function InsightCard({
  icon: Icon,
  title,
  value,
  total,
  label,
  gradient,
}: InsightCardProps) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient}
        style={styles.gradient}
      >
        <Icon color="#FFFFFF" size={24} />
        <View style={styles.content}>
          <Text style={styles.value}>
            {value}
            {total && <Text style={styles.total}>/{total}</Text>}
          </Text>
          {label && <Text style={styles.label}>{label}</Text>}
          {total && <Text style={styles.percentage}>{percentage}%</Text>}
        </View>
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: "47%",
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  value: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  total: {
    fontSize: 18,
    fontWeight: "normal",
    opacity: 0.8,
  },
  label: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  percentage: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});