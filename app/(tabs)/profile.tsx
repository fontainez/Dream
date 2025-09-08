import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { 
  User, 
  Settings, 
  Bell, 
  Moon, 
  Shield, 
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  Share2
} from "lucide-react-native";
import { useUser } from "@/providers/UserProvider";
import { useDreams } from "@/providers/DreamProvider";

export default function ProfileScreen() {
  const { user, updateUser, logout } = useUser();
  const insets = useSafeAreaInsets();
  const { clearAllDreams } = useDreams();
  const [notifications, setNotifications] = React.useState(user?.notifications ?? true);
  const [privateMode, setPrivateMode] = React.useState(user?.privateMode ?? false);

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Déconnexion", 
          style: "destructive",
          onPress: () => logout()
        }
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      "Effacer les données",
      "Cette action supprimera tous vos rêves. Êtes-vous sûr ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Effacer", 
          style: "destructive",
          onPress: () => clearAllDreams()
        }
      ]
    );
  };

  const settingsSections = [
    {
      title: "Compte",
      items: [
        {
          icon: User,
          label: "Modifier le profil",
          onPress: () => {},
          showChevron: true,
        } as const,
        {
          icon: Bell,
          label: "Notifications",
          value: notifications,
          isSwitch: true,
          onValueChange: (value: boolean) => {
            setNotifications(value);
            updateUser({ notifications: value });
          },
        } as const,
        {
          icon: Shield,
          label: "Mode privé",
          value: privateMode,
          isSwitch: true,
          onValueChange: (value: boolean) => {
            setPrivateMode(value);
            updateUser({ privateMode: value });
          },
        } as const,
      ],
    },
    {
      title: "Application",
      items: [
        {
          icon: Moon,
          label: "Thème sombre",
          value: true,
          isSwitch: true,
          disabled: true,
        } as const,
        {
          icon: Star,
          label: "Noter l'application",
          onPress: () => {},
          showChevron: true,
        } as const,
        {
          icon: Share2,
          label: "Partager l'app",
          onPress: () => {},
          showChevron: true,
        } as const,
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Aide & FAQ",
          onPress: () => {},
          showChevron: true,
        } as const,
        {
          icon: Settings,
          label: "Effacer les données",
          onPress: handleClearData,
          showChevron: true,
          danger: true,
        } as const,
      ],
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
            <Text style={styles.title}>Profil</Text>
          </View>

          {/* Profile Card */}
          <LinearGradient
            colors={["#6B46C1", "#9333EA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileCard}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || "R"}
                </Text>
              </View>
            </View>
            <Text style={styles.userName}>{user?.name || "Rêveur"}</Text>
            <Text style={styles.userEmail}>{user?.email || "email@example.com"}</Text>
          </LinearGradient>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContent}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.settingItem,
                      itemIndex === section.items.length - 1 && styles.lastItem
                    ]}
                    onPress={item.onPress}
                    disabled={'isSwitch' in item || ('disabled' in item && item.disabled)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.settingLeft}>
                      <item.icon 
                        color={('danger' in item && item.danger) ? "#EF4444" : "#94A3B8"} 
                        size={20} 
                      />
                      <Text style={[
                        styles.settingLabel,
                        ('danger' in item && item.danger) && styles.dangerText
                      ]}>
                        {item.label}
                      </Text>
                    </View>
                    {'isSwitch' in item ? (
                      <Switch
                        value={'value' in item ? item.value : false}
                        onValueChange={'onValueChange' in item ? item.onValueChange : undefined}
                        disabled={'disabled' in item ? item.disabled : false}
                        trackColor={{ false: "#475569", true: "#9333EA" }}
                        thumbColor="#FFFFFF"
                      />
                    ) : ('showChevron' in item && item.showChevron) ? (
                      <ChevronRight color="#64748B" size={20} />
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>

          {/* Version */}
          <Text style={styles.version}>Version 1.0.0</Text>
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
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: "rgba(148, 163, 184, 0.05)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.1)",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 12,
  },
  dangerText: {
    color: "#EF4444",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 8,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#64748B",
    marginBottom: 40,
  },
});