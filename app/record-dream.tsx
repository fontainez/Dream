import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { 
  X, 
  Mic, 
  MicOff, 
  Sparkles, 
  Hash,
  Calendar,
  Image as ImageIcon,
  Loader2
} from "lucide-react-native";
import { router } from "expo-router";
import { Audio } from "expo-av";
import { useDreams } from "@/providers/DreamProvider";
import { Dream, DreamMood } from "@/types/dream";

export default function RecordDreamScreen() {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [mood, setMood] = useState<DreamMood>("neutral");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const { addDream } = useDreams();

  const moods: { value: DreamMood; emoji: string; label: string }[] = [
    { value: "happy", emoji: "😊", label: "Heureux" },
    { value: "sad", emoji: "😢", label: "Triste" },
    { value: "anxious", emoji: "😰", label: "Anxieux" },
    { value: "peaceful", emoji: "😌", label: "Paisible" },
    { value: "confused", emoji: "😕", label: "Confus" },
    { value: "excited", emoji: "🤩", label: "Excité" },
    { value: "neutral", emoji: "😐", label: "Neutre" },
  ];

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  const startRecording = async () => {
    if (Platform.OS === 'web') {
      Alert.alert("Non disponible", "L'enregistrement vocal n'est pas disponible sur le web. Utilisez la saisie de texte.");
      return;
    }

    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission refusée", "L'accès au microphone est nécessaire pour enregistrer.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error("Erreur lors du démarrage de l'enregistrement:", error);
      Alert.alert("Erreur", "Impossible de démarrer l'enregistrement");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      setIsTranscribing(true);
      
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      
      const uri = recording.getURI();
      if (!uri) {
        throw new Error("Pas d'URI d'enregistrement");
      }

      // Transcribe audio
      const formData = new FormData();
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('audio', {
        uri,
        name: `recording.${fileType}`,
        type: `audio/${fileType}`,
      } as any);
      
      formData.append('language', 'fr');

      const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur de transcription');
      }

      const data = await response.json();
      setContent(prevContent => prevContent + (prevContent ? '\n\n' : '') + data.text);
      
    } catch (error) {
      console.error("Erreur lors de la transcription:", error);
      Alert.alert("Erreur", "Impossible de transcrire l'audio");
    } finally {
      setIsTranscribing(false);
      setRecording(null);
    }
  };

  const generateImage = async () => {
    if (!content && !title) {
      Alert.alert("Erreur", "Ajoutez un titre ou une description pour générer une image");
      return;
    }

    setIsGeneratingImage(true);
    try {
      const prompt = `Dreamlike surreal artistic interpretation of: ${title} ${content}. Style: ethereal, mystical, fantasy art, soft colors, dreamy atmosphere`;
      
      const response = await fetch('https://toolkit.rork.com/images/generate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          size: "1024x1024"
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur de génération');
      }

      const data = await response.json();
      setGeneratedImage(`data:${data.image.mimeType};base64,${data.image.base64Data}`);
    } catch (error) {
      console.error("Erreur lors de la génération d'image:", error);
      Alert.alert("Erreur", "Impossible de générer l'image");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const saveDream = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Erreur", "Le titre et la description sont requis");
      return;
    }

    const newDream: Omit<Dream, "id"> = {
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
      tags,
      mood,
      image: generatedImage,
      isLucid: false,
      isNightmare: mood === "anxious",
    };

    await addDream(newDream);
    router.back();
  };

  return (
    <LinearGradient
      colors={["#0F0F1F", "#1A1A2E", "#16213E"]}
      style={styles.container}
    >
      <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => router.back()}
              >
                <X color="#94A3B8" size={24} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Nouveau Rêve</Text>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveDream}
              >
                <Text style={styles.saveButtonText}>Sauver</Text>
              </TouchableOpacity>
            </View>

            {/* Date */}
            <View style={styles.dateContainer}>
              <Calendar color="#94A3B8" size={16} />
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>

            {/* Title Input */}
            <TextInput
              style={styles.titleInput}
              placeholder="Titre du rêve..."
              placeholderTextColor="#64748B"
              value={title}
              onChangeText={setTitle}
            />

            {/* Content Input */}
            <View style={styles.contentContainer}>
              <TextInput
                style={styles.contentInput}
                placeholder="Décrivez votre rêve..."
                placeholderTextColor="#64748B"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
              />
              
              {/* Voice Recording Button */}
              <TouchableOpacity
                style={[
                  styles.voiceButton,
                  isRecording && styles.voiceButtonActive
                ]}
                onPress={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
              >
                {isTranscribing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : isRecording ? (
                  <MicOff color="#FFFFFF" size={24} />
                ) : (
                  <Mic color="#9333EA" size={24} />
                )}
              </TouchableOpacity>
            </View>

            {/* Mood Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Humeur</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.moodScroll}
              >
                {moods.map((m) => (
                  <TouchableOpacity
                    key={m.value}
                    style={[
                      styles.moodButton,
                      mood === m.value && styles.moodButtonActive
                    ]}
                    onPress={() => setMood(m.value)}
                  >
                    <Text style={styles.moodEmoji}>{m.emoji}</Text>
                    <Text style={[
                      styles.moodLabel,
                      mood === m.value && styles.moodLabelActive
                    ]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Tags */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagInputContainer}>
                <Hash color="#94A3B8" size={16} />
                <TextInput
                  style={styles.tagInput}
                  placeholder="Ajouter un tag..."
                  placeholderTextColor="#64748B"
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={addTag}
                />
              </View>
              <View style={styles.tagsContainer}>
                {tags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.tag}
                    onPress={() => removeTag(tag)}
                  >
                    <Text style={styles.tagText}>#{tag}</Text>
                    <X color="#9333EA" size={14} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* AI Image Generation */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Image IA</Text>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={generateImage}
                disabled={isGeneratingImage}
              >
                <LinearGradient
                  colors={["#9333EA", "#EC4899"]}
                  style={styles.generateGradient}
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 color="#FFFFFF" size={20} />
                      <Text style={styles.generateText}>Génération...</Text>
                    </>
                  ) : (
                    <>
                      <Sparkles color="#FFFFFF" size={20} />
                      <Text style={styles.generateText}>Générer une image</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              
              {generatedImage && (
                <View style={styles.imagePreview}>
                  <ImageIcon color="#94A3B8" size={24} />
                  <Text style={styles.imagePreviewText}>Image générée</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#9333EA",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  dateText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  titleInput: {
    marginHorizontal: 20,
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  contentContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    position: "relative",
  },
  contentInput: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 24,
    minHeight: 150,
    paddingRight: 60,
  },
  voiceButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(147, 51, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  voiceButtonActive: {
    backgroundColor: "#9333EA",
    borderColor: "#9333EA",
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 12,
  },
  moodScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  moodButton: {
    alignItems: "center",
    marginRight: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    minWidth: 70,
  },
  moodButtonActive: {
    backgroundColor: "rgba(147, 51, 234, 0.2)",
    borderWidth: 1,
    borderColor: "#9333EA",
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    color: "#94A3B8",
  },
  moodLabelActive: {
    color: "#9333EA",
  },
  tagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#FFFFFF",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(147, 51, 234, 0.1)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  tagText: {
    fontSize: 14,
    color: "#9333EA",
  },
  generateButton: {
    height: 48,
    borderRadius: 12,
    overflow: "hidden",
  },
  generateGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  generateText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  imagePreview: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    gap: 8,
  },
  imagePreviewText: {
    color: "#94A3B8",
    fontSize: 14,
  },
});