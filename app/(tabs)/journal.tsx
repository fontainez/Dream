import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { Search, Filter, Calendar as CalendarIcon, Plus } from "lucide-react-native";
import { useDreams } from "@/providers/DreamProvider";
import DreamCard from "@/components/DreamCard";
import EmptyState from "@/components/EmptyState";
import { formatMonth } from "@/utils/dateHelpers";
import { router } from "expo-router";



export default function JournalScreen() {
  const { dreams } = useDreams();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Group dreams by month
  const dreamsByMonth = useMemo(() => {
    const grouped: { [key: string]: typeof dreams } = {};
    
    dreams.forEach(dream => {
      const monthKey = formatMonth(new Date(dream.date));
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(dream);
    });

    return grouped;
  }, [dreams]);

  // Filter dreams based on search
  const filteredDreams = useMemo(() => {
    let filtered = dreams;

    if (searchQuery) {
      filtered = filtered.filter(dream =>
        dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedMonth) {
      const monthDreams = dreamsByMonth[selectedMonth] || [];
      filtered = filtered.filter(dream => monthDreams.includes(dream));
    }

    return filtered;
  }, [dreams, searchQuery, selectedMonth, dreamsByMonth]);

  const months = Object.keys(dreamsByMonth).sort((a, b) => {
    const dateA = new Date(dreamsByMonth[a][0].date);
    const dateB = new Date(dreamsByMonth[b][0].date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <LinearGradient
      colors={["#0F0F1F", "#1A1A2E", "#16213E"]}
      style={styles.container}
    >
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Journal des Rêves</Text>
          <Text style={styles.subtitle}>{dreams.length} rêves enregistrés</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search color="#94A3B8" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un rêve..."
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter color="#9333EA" size={20} />
          </TouchableOpacity>
        </View>

        {/* Month Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.monthFilter}
          contentContainerStyle={styles.monthFilterContent}
        >
          <TouchableOpacity
            style={[
              styles.monthChip,
              !selectedMonth && styles.monthChipActive
            ]}
            onPress={() => setSelectedMonth(null)}
          >
            <Text style={[
              styles.monthChipText,
              !selectedMonth && styles.monthChipTextActive
            ]}>
              Tous
            </Text>
          </TouchableOpacity>
          {months.map(month => (
            <TouchableOpacity
              key={month}
              style={[
                styles.monthChip,
                selectedMonth === month && styles.monthChipActive
              ]}
              onPress={() => setSelectedMonth(month)}
            >
              <CalendarIcon 
                size={14} 
                color={selectedMonth === month ? "#FFFFFF" : "#94A3B8"} 
                style={{ marginRight: 4 }}
              />
              <Text style={[
                styles.monthChipText,
                selectedMonth === month && styles.monthChipTextActive
              ]}>
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Dreams List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.dreamsList}
          contentContainerStyle={styles.dreamsContent}
        >
          {filteredDreams.length > 0 ? (
            filteredDreams.map(dream => (
              <DreamCard key={dream.id} dream={dream} />
            ))
          ) : (
            <EmptyState 
              message={searchQuery ? "Aucun rêve trouvé" : "Commencez à enregistrer vos rêves"}
            />
          )}
        </ScrollView>
        
        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/record-dream')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#9333EA', '#EC4899']}
            style={styles.fabGradient}
          >
            <Plus color="#FFFFFF" size={24} />
          </LinearGradient>
        </TouchableOpacity>
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
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#FFFFFF",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(147, 51, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  monthFilter: {
    maxHeight: 50,
    marginBottom: 16,
  },
  monthFilterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  monthChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  monthChipActive: {
    backgroundColor: "#9333EA",
    borderColor: "#9333EA",
  },
  monthChipText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
  monthChipTextActive: {
    color: "#FFFFFF",
  },
  dreamsList: {
    flex: 1,
  },
  dreamsContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});