import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { Dream, DreamStats } from "@/types/dream";

const STORAGE_KEY = "@dreams_storage";

// eslint-disable-next-line @rork/linters/general-context-optimization
export const [DreamProvider, useDreams] = createContextHook(() => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load dreams from storage
  const loadDreams = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDreams(JSON.parse(stored));
      } else {
        // Add sample dreams for testing
        const sampleDreams: Dream[] = [
          {
            id: '1',
            title: 'Vol au-dessus des nuages',
            content: 'Je volais librement au-dessus des nuages blancs et moelleux. Le ciel était d\'un bleu éclatant et je ressentais une sensation de liberté absolue. Les montagnes en dessous ressemblaient à des jouets miniatures.',
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            tags: ['vol', 'liberté', 'nuages'],
            mood: 'peaceful',
            isLucid: true,
            isNightmare: false,
            analysis: 'Ce rêve de vol symbolise votre désir de liberté et d\'évasion. Voler au-dessus des nuages représente votre capacité à prendre du recul sur les situations et à voir les choses d\'une perspective plus élevée. La sensation de paix indique que vous êtes en harmonie avec vos aspirations.',
            recommendations: [
              'Prenez du temps pour méditer et vous connecter à votre liberté intérieure',
              'Explorez de nouvelles perspectives dans votre vie quotidienne',
              'Faites confiance à votre capacité à surmonter les obstacles'
            ],
          },
          {
            id: '2',
            title: 'Rencontre avec un dragon',
            content: 'Un magnifique dragon doré est apparu dans ma chambre. Au lieu d\'avoir peur, j\'ai ressenti une connexion profonde avec cette créature majestueuse. Nous avons communiqué sans paroles.',
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            tags: ['dragon', 'magie', 'connexion'],
            mood: 'excited',
            isLucid: false,
            isNightmare: false,
            analysis: 'Le dragon doré représente la sagesse ancienne et la force intérieure. Cette rencontre paisible suggère que vous êtes prêt à embrasser votre pouvoir personnel et votre sagesse intuitive. La communication sans paroles indique une connexion profonde avec votre subconscient.',
            recommendations: [
              'Écoutez votre intuition dans les décisions importantes',
              'Embrassez votre force intérieure et votre sagesse',
              'Soyez ouvert aux messages de votre subconscient'
            ],
          },
          {
            id: '3',
            title: 'Labyrinthe sans fin',
            content: 'Je me trouvais dans un labyrinthe sombre avec des murs qui bougeaient constamment. Plus j\'essayais de trouver la sortie, plus les couloirs semblaient s\'allonger. Une sensation d\'angoisse m\'envahissait.',
            date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            tags: ['labyrinthe', 'perdu', 'angoisse'],
            mood: 'anxious',
            isLucid: false,
            isNightmare: true,
            analysis: 'Ce labyrinthe représente les défis complexes de votre vie actuelle. Les murs qui bougent symbolisent les situations changeantes qui vous désorientent. L\'angoisse reflète votre sentiment d\'être submergé par les circonstances.',
            recommendations: [
              'Prenez une pause et respirez profondément quand vous vous sentez dépassé',
              'Décomposez les problèmes complexes en étapes plus simples',
              'Demandez de l\'aide à vos proches quand vous en avez besoin'
            ],
          },
        ];
        setDreams(sampleDreams);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleDreams));
      }
    } catch (error) {
      console.error("Error loading dreams:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save dreams to storage
  const saveDreams = useCallback(async (dreamsToSave: Dream[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dreamsToSave));
    } catch (error) {
      console.error("Error saving dreams:", error);
    }
  }, []);

  // Add a new dream
  const addDream = useCallback(async (dream: Omit<Dream, "id">) => {
    const newDream: Dream = {
      ...dream,
      id: Date.now().toString(),
    };
    const updatedDreams = [newDream, ...dreams];
    setDreams(updatedDreams);
    await saveDreams(updatedDreams);
    return newDream;
  }, [dreams, saveDreams]);

  // Update a dream
  const updateDream = useCallback(async (id: string, updates: Partial<Dream>) => {
    const updatedDreams = dreams.map(dream =>
      dream.id === id ? { ...dream, ...updates } : dream
    );
    setDreams(updatedDreams);
    await saveDreams(updatedDreams);
  }, [dreams, saveDreams]);

  // Delete a dream
  const deleteDream = useCallback(async (id: string) => {
    const updatedDreams = dreams.filter(dream => dream.id !== id);
    setDreams(updatedDreams);
    await saveDreams(updatedDreams);
  }, [dreams, saveDreams]);

  // Clear all dreams
  const clearAllDreams = useCallback(async () => {
    setDreams([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  // Refresh dreams
  const refreshDreams = useCallback(async () => {
    await loadDreams();
  }, [loadDreams]);

  // Get dream statistics
  const getDreamStats = useCallback((): DreamStats => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentDreams = dreams.filter(dream => 
      new Date(dream.date) >= oneWeekAgo
    );

    const lucidDreams = dreams.filter(dream => dream.isLucid).length;
    const nightmares = dreams.filter(dream => dream.isNightmare).length;
    const positiveDreams = dreams.filter(dream => 
      ["happy", "peaceful", "excited"].includes(dream.mood)
    ).length;

    // Calculate streaks
    const sortedDreams = [...dreams].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    sortedDreams.forEach(dream => {
      const dreamDate = new Date(dream.date);
      dreamDate.setHours(0, 0, 0, 0);
      
      if (!lastDate) {
        tempStreak = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dreamDate.getTime() === today.getTime()) {
          currentStreak = 1;
        }
      } else {
        const dayDiff = (lastDate.getTime() - dreamDate.getTime()) / (1000 * 60 * 60 * 24);
        if (dayDiff === 1) {
          tempStreak++;
          if (currentStreak > 0 && tempStreak > currentStreak) {
            currentStreak = tempStreak;
          }
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      lastDate = dreamDate;
    });
    
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate recurring themes
    const allTags = dreams.flatMap(dream => dream.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    const recurringThemes = Object.entries(tagCounts)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // Mood distribution
    const moodCounts = dreams.reduce((acc, dream) => {
      acc[dream.mood] = (acc[dream.mood] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const moodDistribution = [
      { 
        label: "Positif", 
        percentage: Math.round(((moodCounts.happy || 0) + (moodCounts.peaceful || 0) + (moodCounts.excited || 0)) / dreams.length * 100) || 0,
        emoji: "😊",
        gradient: ["#10B981", "#059669"]
      },
      { 
        label: "Négatif", 
        percentage: Math.round(((moodCounts.sad || 0) + (moodCounts.anxious || 0)) / dreams.length * 100) || 0,
        emoji: "😔",
        gradient: ["#EF4444", "#DC2626"]
      },
      { 
        label: "Neutre", 
        percentage: Math.round(((moodCounts.neutral || 0) + (moodCounts.confused || 0)) / dreams.length * 100) || 0,
        emoji: "😐",
        gradient: ["#6B7280", "#4B5563"]
      },
    ];

    return {
      totalDreams: dreams.length,
      averageDreamsPerWeek: recentDreams.length,
      lucidDreams,
      nightmares,
      positiveDreams,
      currentStreak,
      longestStreak,
      recurringThemes,
      moodDistribution,
    };
  }, [dreams]);

  useEffect(() => {
    loadDreams();
  }, [loadDreams]);

  return {
    dreams,
    isLoading,
    addDream,
    updateDream,
    deleteDream,
    clearAllDreams,
    refreshDreams,
    getDreamStats,
  };
});