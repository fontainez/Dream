import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Plus,
  Moon,
  Sparkles,
  TrendingUp,
  Calendar,
  Target,
  Lightbulb,
  Heart,
} from 'lucide-react-native';
import { useDreams } from '@/providers/DreamProvider';
import { useUser } from '@/providers/UserProvider';

export default function HomeScreen() {
  const { dreams, getDreamStats } = useDreams();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const stats = getDreamStats();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const recentDreams = dreams.slice(0, 3);
  const todaysDream = dreams.find(dream => {
    const today = new Date();
    const dreamDate = new Date(dream.date);
    return dreamDate.toDateString() === today.toDateString();
  });

  const getTodaysRecommendation = () => {
    const recommendations = [
      "Faites confiance à votre intuition aujourd&apos;hui",
      "Prenez un moment pour méditer sur vos rêves",
      "Écoutez votre voix intérieure",
      "Soyez ouvert aux nouvelles possibilités",
      "Cultivez la gratitude dans votre quotidien",
      "Laissez votre créativité s&apos;exprimer",
      "Accordez-vous du temps pour la réflexion",
    ];
    return recommendations[new Date().getDay()];
  };

  return (
    <LinearGradient
      colors={['#0F0F1F', '#1A1A2E', '#16213E']}
      style={styles.container}
    >
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{user?.name || 'Rêveur'} ✨</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/record-dream')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#9333EA', '#7C3AED']}
                style={styles.addButtonGradient}
              >
                <Plus color="#FFFFFF" size={24} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Today's Inspiration */}
          <LinearGradient
            colors={['#6B46C1', '#9333EA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.inspirationCard}
          >
            <View style={styles.inspirationHeader}>
              <Lightbulb color="#FFFFFF" size={20} />
              <Text style={styles.inspirationTitle}>Inspiration du jour</Text>
            </View>
            <Text style={styles.inspirationText}>{getTodaysRecommendation()}</Text>
          </LinearGradient>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.statGradient}
                >
                  <Moon color="#FFFFFF" size={20} />
                  <Text style={styles.statNumber}>{stats.totalDreams}</Text>
                  <Text style={styles.statLabel}>Rêves</Text>
                </LinearGradient>
              </View>
              
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.statGradient}
                >
                  <Target color="#FFFFFF" size={20} />
                  <Text style={styles.statNumber}>{stats.currentStreak}</Text>
                  <Text style={styles.statLabel}>Série</Text>
                </LinearGradient>
              </View>
              
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.statGradient}
                >
                  <Sparkles color="#FFFFFF" size={20} />
                  <Text style={styles.statNumber}>{stats.lucidDreams}</Text>
                  <Text style={styles.statLabel}>Lucides</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Today's Dream Status */}
          {todaysDream ? (
            <TouchableOpacity
              style={styles.todayDreamCard}
              onPress={() => router.push(`/dream/${todaysDream.id}`)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.1)', 'rgba(5, 150, 105, 0.1)']}
                style={styles.todayDreamGradient}
              >
                <View style={styles.todayDreamHeader}>
                  <Heart color="#10B981" size={20} />
                  <Text style={styles.todayDreamTitle}>Rêve d&apos;aujourd&apos;hui</Text>
                </View>
                <Text style={styles.todayDreamContent} numberOfLines={2}>
                  {todaysDream.title}
                </Text>
                <Text style={styles.todayDreamSubtext}>Appuyez pour voir les détails</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.todayDreamCard}
              onPress={() => router.push('/record-dream')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(147, 51, 234, 0.1)', 'rgba(124, 58, 237, 0.1)']}
                style={styles.todayDreamGradient}
              >
                <View style={styles.todayDreamHeader}>
                  <Plus color="#9333EA" size={20} />
                  <Text style={styles.todayDreamTitle}>Aucun rêve aujourd&apos;hui</Text>
                </View>
                <Text style={styles.todayDreamContent}>
                  Enregistrez votre premier rêve de la journée
                </Text>
                <Text style={styles.todayDreamSubtext}>Appuyez pour commencer</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Recent Dreams */}
          {recentDreams.length > 0 && (
            <View style={styles.recentSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Rêves récents</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/journal')}>
                  <Text style={styles.seeAllText}>Voir tout</Text>
                </TouchableOpacity>
              </View>
              
              {recentDreams.map((dream) => (
                <TouchableOpacity
                  key={dream.id}
                  style={styles.recentDreamCard}
                  onPress={() => router.push(`/dream/${dream.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.recentDreamContent}>
                    <Text style={styles.recentDreamTitle} numberOfLines={1}>
                      {dream.title}
                    </Text>
                    <Text style={styles.recentDreamDate}>
                      {new Date(dream.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Text>
                  </View>
                  <View style={styles.recentDreamMeta}>
                    {dream.isLucid && <Sparkles color="#F59E0B" size={16} />}
                    <Text style={styles.recentDreamMood}>
                      {dream.mood === 'happy' && '😊'}
                      {dream.mood === 'sad' && '😢'}
                      {dream.mood === 'anxious' && '😰'}
                      {dream.mood === 'peaceful' && '😌'}
                      {dream.mood === 'confused' && '😕'}
                      {dream.mood === 'excited' && '🤩'}
                      {dream.mood === 'neutral' && '😐'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/(tabs)/insights')}
                activeOpacity={0.8}
              >
                <TrendingUp color="#9333EA" size={24} />
                <Text style={styles.actionText}>Analyses</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/(tabs)/journal')}
                activeOpacity={0.8}
              >
                <Calendar color="#9333EA" size={24} />
                <Text style={styles.actionText}>Journal</Text>
              </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  addButton: {
    borderRadius: 20,
  },
  addButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inspirationCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  inspirationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inspirationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  inspirationText: {
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
  },
  statGradient: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  todayDreamCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  todayDreamGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  todayDreamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  todayDreamTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  todayDreamContent: {
    fontSize: 16,
    color: '#E2E8F0',
    lineHeight: 24,
    marginBottom: 8,
  },
  todayDreamSubtext: {
    fontSize: 14,
    color: '#94A3B8',
  },
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#9333EA',
    fontWeight: '600',
  },
  recentDreamCard: {
    backgroundColor: 'rgba(148, 163, 184, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentDreamContent: {
    flex: 1,
  },
  recentDreamTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  recentDreamDate: {
    fontSize: 14,
    color: '#94A3B8',
  },
  recentDreamMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentDreamMood: {
    fontSize: 20,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionCard: {
    backgroundColor: 'rgba(148, 163, 184, 0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
  },
});