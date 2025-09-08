import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { TrendingUp, Moon, Zap, Heart, Brain } from "lucide-react-native";
import { useDreams } from "@/providers/DreamProvider";
import InsightCard from "@/components/InsightCard";
import DreamPattern from "@/components/DreamPattern";



export default function InsightsScreen() {
  const { dreams, getDreamStats } = useDreams();
  const insets = useSafeAreaInsets();
  const stats = getDreamStats();

  const insights = [
    {
      icon: Moon,
      title: "Rêves Lucides",
      value: stats.lucidDreams,
      total: dreams.length,
      color: "#9333EA",
      gradient: ["#9333EA", "#6B46C1"],
    },
    {
      icon: Zap,
      title: "Cauchemars",
      value: stats.nightmares,
      total: dreams.length,
      color: "#EF4444",
      gradient: ["#EF4444", "#DC2626"],
    },
    {
      icon: Heart,
      title: "Rêves Positifs",
      value: stats.positiveDreams,
      total: dreams.length,
      color: "#10B981",
      gradient: ["#10B981", "#059669"],
    },
    {
      icon: Brain,
      title: "Rêves Récurrents",
      value: stats.recurringThemes.length,
      label: "thèmes",
      color: "#F59E0B",
      gradient: ["#F59E0B", "#D97706"],
    },
  ];

  return (
    <LinearGradient
      colors={["#0F0F1F", "#1A1A2E", "#16213E"]}
      style={styles.container}
    >
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Analyses</Text>
            <Text style={styles.subtitle}>
              Découvrez les patterns de vos rêves
            </Text>
          </View>

          {/* Main Stats */}
          <LinearGradient
            colors={["#6B46C1", "#9333EA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainCard}
          >
            <View style={styles.mainCardContent}>
              <TrendingUp color="#FFFFFF" size={32} />
              <View style={styles.mainStats}>
                <Text style={styles.mainStatValue}>
                  {stats.averageDreamsPerWeek.toFixed(1)}
                </Text>
                <Text style={styles.mainStatLabel}>
                  Rêves par semaine en moyenne
                </Text>
              </View>
            </View>
            <View style={styles.streakContainer}>
              <View style={styles.streakItem}>
                <Text style={styles.streakValue}>{stats.currentStreak}</Text>
                <Text style={styles.streakLabel}>Jours consécutifs</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <Text style={styles.streakValue}>{stats.longestStreak}</Text>
                <Text style={styles.streakLabel}>Record</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Insight Cards */}
          <View style={styles.insightsGrid}>
            {insights.map((insight, index) => (
              <InsightCard key={index} {...insight} />
            ))}
          </View>

          {/* Dream Patterns */}
          <View style={styles.patternsSection}>
            <Text style={styles.sectionTitle}>Thèmes Récurrents</Text>
            <DreamPattern themes={stats.recurringThemes} />
          </View>

          {/* Mood Analysis */}
          <View style={styles.moodSection}>
            <Text style={styles.sectionTitle}>Analyse Émotionnelle</Text>
            <View style={styles.moodCards}>
              {stats.moodDistribution.map((mood, index) => (
                <View key={index} style={styles.moodCard}>
                  <LinearGradient
                    colors={mood.gradient as [string, string]}
                    style={styles.moodGradient}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={styles.moodPercent}>{mood.percentage}%</Text>
                    <Text style={styles.moodLabel}>{mood.label}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
  },
  mainCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  mainCardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  mainStats: {
    marginLeft: 16,
    flex: 1,
  },
  mainStatValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  mainStatLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
  },
  streakItem: {
    flex: 1,
    alignItems: "center",
  },
  streakValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  streakLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  streakDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 16,
  },
  insightsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  patternsSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  moodSection: {
    marginTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  moodCards: {
    flexDirection: "row",
    gap: 12,
  },
  moodCard: {
    flex: 1,
  },
  moodGradient: {
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodPercent: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  moodLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
});