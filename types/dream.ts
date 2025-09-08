export type DreamMood = "happy" | "sad" | "anxious" | "peaceful" | "confused" | "excited" | "neutral";

export interface Dream {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  mood: DreamMood;
  image?: string | null;
  isLucid: boolean;
  isNightmare: boolean;
  analysis?: string;
  recommendations?: string[];
}

export interface DreamStats {
  totalDreams: number;
  averageDreamsPerWeek: number;
  lucidDreams: number;
  nightmares: number;
  positiveDreams: number;
  currentStreak: number;
  longestStreak: number;
  recurringThemes: { tag: string; count: number }[];
  moodDistribution: {
    label: string;
    percentage: number;
    emoji: string;
    gradient: string[];
  }[];
}