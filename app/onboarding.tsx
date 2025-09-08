import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { Moon, Sparkles, ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { useUser } from "@/providers/UserProvider";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";



export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const { updateUser } = useUser();

  const handleComplete = async () => {
    await updateUser({ 
      name: name || "Rêveur",
      hasCompletedOnboarding: true,
      notifications: true,
      privateMode: false
    });
    router.replace("/(tabs)/journal");
  };

  const steps = [
    {
      icon: Moon,
      title: "Bienvenue dans votre\nJournal de Rêves",
      subtitle: "Capturez et explorez vos rêves\navec l'intelligence artificielle",
    },
    {
      icon: Sparkles,
      title: "Comment vous\nappeler ?",
      subtitle: "Personnalisons votre expérience",
      input: true,
    },
  ];

  const currentStep = steps[step];

  return (
    <LinearGradient
      colors={["#0F0F1F", "#1A1A2E", "#6B46C1"]}
      style={styles.container}
    >
      <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          {/* Progress */}
          <View style={styles.progressContainer}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= step && styles.progressDotActive,
                ]}
              />
            ))}
          </View>

          {/* Content */}
          <View style={styles.centerContent}>
            {Platform.OS === "web" ? (
              <>
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={["#9333EA", "#EC4899"]}
                    style={styles.iconGradient}
                  >
                    <currentStep.icon color="#FFFFFF" size={48} />
                  </LinearGradient>
                </View>

                <Text style={styles.title}>{currentStep.title}</Text>
                <Text style={styles.subtitle}>{currentStep.subtitle}</Text>

                {currentStep.input && (
                  <TextInput
                    style={styles.input}
                    placeholder="Votre prénom"
                    placeholderTextColor="#64748B"
                    value={name}
                    onChangeText={setName}
                    autoFocus
                  />
                )}
              </>
            ) : (
              <>
                <Animated.View 
                  entering={FadeInDown.delay(200)}
                  style={styles.iconContainer}
                >
                  <LinearGradient
                    colors={["#9333EA", "#EC4899"]}
                    style={styles.iconGradient}
                  >
                    <currentStep.icon color="#FFFFFF" size={48} />
                  </LinearGradient>
                </Animated.View>

                <Animated.Text 
                  entering={FadeInUp.delay(400)}
                  style={styles.title}
                >
                  {currentStep.title}
                </Animated.Text>
                <Animated.Text 
                  entering={FadeInUp.delay(600)}
                  style={styles.subtitle}
                >
                  {currentStep.subtitle}
                </Animated.Text>

                {currentStep.input && (
                  <Animated.View 
                    entering={FadeInUp.delay(800)}
                    style={{ width: "100%" }}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder="Votre prénom"
                      placeholderTextColor="#64748B"
                      value={name}
                      onChangeText={setName}
                      autoFocus
                    />
                  </Animated.View>
                )}
              </>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {step > 0 && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setStep(step - 1)}
              >
                <Text style={styles.secondaryButtonText}>Retour</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1);
                } else {
                  handleComplete();
                }
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#9333EA", "#6B46C1"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.primaryButtonText}>
                  {step === steps.length - 1 ? "Commencer" : "Continuer"}
                </Text>
                <ChevronRight color="#FFFFFF" size={20} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 40,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(148, 163, 184, 0.3)",
  },
  progressDotActive: {
    backgroundColor: "#9333EA",
    width: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 26,
  },
  input: {
    width: "100%",
    maxWidth: 300,
    height: 56,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 40,
  },
  secondaryButton: {
    flex: 1,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94A3B8",
  },
  primaryButton: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});