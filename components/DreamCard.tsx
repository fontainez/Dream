import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { Calendar, Hash } from "lucide-react-native";
import { router } from "expo-router";
import { Dream } from "@/types/dream";
import { formatDate } from "@/utils/dateHelpers";

interface DreamCardProps {
  dream: Dream;
}

export default function DreamCard({ dream }: DreamCardProps) {
  const getMoodColor = (mood: string) => {
    const colors: { [key: string]: string } = {
      happy: "#10B981",
      sad: "#3B82F6",
      anxious: "#EF4444",
      peaceful: "#8B5CF6",
      confused: "#F59E0B",
      excited: "#EC4899",
      neutral: "#6B7280",
    };
    return colors[mood] || "#6B7280";
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/dream/${dream.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {dream.title}
          </Text>
          <View style={[styles.moodIndicator, { backgroundColor: getMoodColor(dream.mood) }]} />
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {dream.content}
        </Text>

        <View style={styles.footer}>
          <View style={styles.date}>
            <Calendar color="#64748B" size={12} />
            <Text style={styles.dateText}>{formatDate(new Date(dream.date))}</Text>
          </View>
          
          {dream.tags.length > 0 && (
            <View style={styles.tags}>
              {dream.tags.slice(0, 2).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Hash color="#9333EA" size={10} />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
              {dream.tags.length > 2 && (
                <Text style={styles.moreTags}>+{dream.tags.length - 2}</Text>
              )}
            </View>
          )}
        </View>

        {dream.image && (
          <Image source={{ uri: dream.image }} style={styles.thumbnail} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(148, 163, 184, 0.05)",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    overflow: "hidden",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 8,
  },
  moodIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#64748B",
  },
  tags: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(147, 51, 234, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 2,
  },
  tagText: {
    fontSize: 11,
    color: "#9333EA",
  },
  moreTags: {
    fontSize: 11,
    color: "#64748B",
  },
  thumbnail: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 8,
    opacity: 0.8,
  },
});