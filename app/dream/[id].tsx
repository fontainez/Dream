import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { 
  ArrowLeft, 
  Calendar, 
  Hash, 
  Sparkles,
  Share2,
  Trash2,
  Edit,
  Lightbulb,
  Home
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useDreams } from "@/providers/DreamProvider";
import { formatDate } from "@/utils/dateHelpers";

const { width } = Dimensions.get("window");

export default function DreamDetailScreen() {
  const { id } = useLocalSearchParams();
  const { dreams, deleteDream } = useDreams();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  
  const dream = dreams.find(d => d.id === id);

  if (!dream) {
    return (
      <LinearGradient
        colors={["#0F0F1F", "#1A1A2E", "#16213E"]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Rêve non trouvé</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backLink}>Retour</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Supprimer le rêve",
      "Êtes-vous sûr de vouloir supprimer ce rêve ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: () => {
            deleteDream(dream.id);
            router.back();
          }
        }
      ]
    );
  };

  const analyzeDream = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert en interprétation des rêves. Analyse ce rêve en français et donne une interprétation symbolique et psychologique courte (3-4 phrases maximum).'
            },
            {
              role: 'user',
              content: `Titre: ${dream.title}\n\nDescription: ${dream.content}\n\nHumeur: ${dream.mood}`
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur d\'analyse');
      }

      const data = await response.json();
      setAnalysis(data.completion);
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      Alert.alert("Erreur", "Impossible d'analyser le rêve");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateRecommendations = async () => {
    setIsGeneratingRecommendations(true);
    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'Tu es un coach de vie spécialisé dans l\'interprétation des rêves. Basé sur ce rêve, donne 3-4 recommandations pratiques et positives pour la vie quotidienne de la personne. Chaque recommandation doit être courte (une phrase) et commencer par un verbe d\'action. Réponds uniquement avec les recommandations, une par ligne, sans numérotation.'
            },
            {
              role: 'user',
              content: `Titre: ${dream.title}\n\nDescription: ${dream.content}\n\nHumeur: ${dream.mood}`
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur de génération');
      }

      const data = await response.json();
      const recommendations = data.completion.split('\n').filter((line: string) => line.trim().length > 0);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      Alert.alert("Erreur", "Impossible de générer les recommandations");
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  const getMoodEmoji = (mood: string) => {
    const moods: { [key: string]: string } = {
      happy: "😊",
      sad: "😢",
      anxious: "😰",
      peaceful: "😌",
      confused: "😕",
      excited: "🤩",
      neutral: "😐",
    };
    return moods[mood] || "😐";
  };

  return (
    <LinearGradient
      colors={["#0F0F1F", "#1A1A2E", "#16213E"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft color="#94A3B8" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => router.push('/(tabs)/home')}
              >
                <Home color="#94A3B8" size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Share2 color="#94A3B8" size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Edit color="#94A3B8" size={20} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleDelete}
              >
                <Trash2 color="#EF4444" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Dream Image */}
          {dream.image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: dream.image }} style={styles.dreamImage} />
              <LinearGradient
                colors={["transparent", "rgba(15, 15, 31, 0.8)", "#0F0F1F"]}
                style={styles.imageGradient}
              />
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>
            {/* Title and Date */}
            <Text style={styles.title}>{dream.title}</Text>
            <View style={styles.metaContainer}>
              <Calendar color="#94A3B8" size={16} />
              <Text style={styles.date}>{formatDate(new Date(dream.date))}</Text>
              <Text style={styles.mood}>{getMoodEmoji(dream.mood)}</Text>
            </View>

            {/* Tags */}
            {dream.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {dream.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Hash color="#9333EA" size={12} />
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Dream Content */}
            <Text style={styles.dreamContent}>{dream.content}</Text>

            {/* AI Analysis Buttons */}
            <View style={styles.aiButtonsContainer}>
              <TouchableOpacity
                style={[styles.aiButton, { flex: 1, marginRight: 8 }]}
                onPress={analyzeDream}
                disabled={isAnalyzing}
              >
                <LinearGradient
                  colors={["#9333EA", "#EC4899"]}
                  style={styles.aiButtonGradient}
                >
                  <Sparkles color="#FFFFFF" size={18} />
                  <Text style={styles.aiButtonText}>
                    {isAnalyzing ? "Analyse..." : "Analyser"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.aiButton, { flex: 1, marginLeft: 8 }]}
                onPress={generateRecommendations}
                disabled={isGeneratingRecommendations}
              >
                <LinearGradient
                  colors={["#F59E0B", "#D97706"]}
                  style={styles.aiButtonGradient}
                >
                  <Lightbulb color="#FFFFFF" size={18} />
                  <Text style={styles.aiButtonText}>
                    {isGeneratingRecommendations ? "Génération..." : "Conseils"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Stored Analysis */}
            {dream.analysis && (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisTitle}>Analyse du rêve</Text>
                <Text style={styles.analysisText}>{dream.analysis}</Text>
              </View>
            )}

            {/* Stored Recommendations */}
            {dream.recommendations && dream.recommendations.length > 0 && (
              <View style={styles.recommendationsContainer}>
                <View style={styles.recommendationsHeader}>
                  <Lightbulb color="#F59E0B" size={20} />
                  <Text style={styles.recommendationsTitle}>Recommandations</Text>
                </View>
                {dream.recommendations.map((recommendation, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={styles.recommendationBullet}>•</Text>
                    <Text style={styles.recommendationText}>{recommendation}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* AI Analysis */}
            {analysis && (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisTitle}>Interprétation IA</Text>
                <Text style={styles.analysisText}>{analysis}</Text>
              </View>
            )}

            {/* AI Recommendations */}
            {aiRecommendations.length > 0 && (
              <View style={styles.recommendationsContainer}>
                <View style={styles.recommendationsHeader}>
                  <Sparkles color="#9333EA" size={20} />
                  <Text style={styles.recommendationsTitle}>Recommandations IA</Text>
                </View>
                {aiRecommendations.map((recommendation, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={styles.recommendationBullet}>•</Text>
                    <Text style={styles.recommendationText}>{recommendation}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Dream Type Badges */}
            <View style={styles.badgesContainer}>
              {dream.isLucid && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>✨ Rêve Lucide</Text>
                </View>
              )}
              {dream.isNightmare && (
                <View style={[styles.badge, styles.nightmareBadge]}>
                  <Text style={styles.badgeText}>⚡ Cauchemar</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: "absolute",
    top: 44,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(15, 15, 31, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(15, 15, 31, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    height: 400,
    position: "relative",
  },
  dreamImage: {
    width: width,
    height: 400,
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  content: {
    padding: 20,
    marginTop: -40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  date: {
    color: "#94A3B8",
    fontSize: 14,
  },
  mood: {
    fontSize: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(147, 51, 234, 0.1)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  tagText: {
    fontSize: 12,
    color: "#9333EA",
  },
  dreamContent: {
    fontSize: 16,
    lineHeight: 26,
    color: "#E2E8F0",
    marginBottom: 32,
  },
  analyzeButton: {
    height: 48,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  analyzeGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  analyzeText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  analysisContainer: {
    backgroundColor: "rgba(147, 51, 234, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.2)",
  },
  analysisTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9333EA",
    marginBottom: 8,
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#E2E8F0",
  },
  badgesContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 40,
  },
  badge: {
    backgroundColor: "rgba(147, 51, 234, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.4)",
  },
  nightmareBadge: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  backLink: {
    color: "#9333EA",
    fontSize: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  homeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(15, 15, 31, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  aiButtonsContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  aiButton: {
    height: 44,
    borderRadius: 12,
    overflow: "hidden",
  },
  aiButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  aiButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  recommendationsContainer: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
  recommendationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F59E0B",
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  recommendationBullet: {
    fontSize: 16,
    color: "#F59E0B",
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#E2E8F0",
    flex: 1,
  },
});