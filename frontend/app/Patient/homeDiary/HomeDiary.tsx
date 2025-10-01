import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

export default function HomeDiary() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const slideAnim = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    const loadUserAndEntries = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) {
        setUserId(id);
        fetchEntries(id);
      }
    };
    loadUserAndEntries();
  }, []);

  const fetchEntries = async (id: string) => {
    try {
      const res = await axios.get(`http://localhost:3000/diary/list/${id}`);
      setEntries(res.data);
    } catch (err) {
      console.error("Erro ao buscar entradas:", err);
    }
  };

  const deleteEntry = async (entryId: string) => {
    try {
      await axios.delete(`http://localhost:3000/diary/delete/${entryId}`, {
        data: { user_id: userId },
      });
      Alert.alert("Sucesso", "Nota deletada!");
      if (userId) fetchEntries(userId);
    } catch (err) {
      console.error("Erro ao deletar entrada:", err);
      Alert.alert("Erro", "Não foi possível deletar a nota.");
    }
  };

  const renderRightActions = (entryId: string) => (
    <TouchableOpacity onPress={() => deleteEntry(entryId)} style={styles.deleteButton}>
      <Image
        source={require("../../../assets/icons/delete.png")}
        style={styles.deleteIcon}
      />
    </TouchableOpacity>
  );

  const toggleMenu = () => {
    const novoEstado = !menuVisible;
    setMenuVisible(novoEstado);

    Animated.timing(slideAnim, {
      toValue: novoEstado ? 0 : -250,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace("/onboarding/Onboarding");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Diário emocional</Text>
          <TouchableOpacity onPress={toggleMenu}>
            <Image
              source={require("../../../assets/icons/menu.png")}
              style={styles.menuIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Conteúdo principal */}
        <ScrollView style={styles.content}>
          {entries.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Nenhuma entrada ainda
            </Text>
          ) : (
            entries.map((entry) => {
              const lines = entry.content.split("\n");
              const title = lines[0] || "Sem título";
              const date = entry.created_at
                ? new Date(entry.created_at).toLocaleDateString("pt-BR")
                : "";

              return (
                <Swipeable
                  key={entry.id}
                  renderRightActions={() => renderRightActions(entry.id)}
                >
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "../newNote/NewNote",
                        params: { id: entry.id },
                      })
                    }
                  >
                    <View style={styles.entryCard}>
                      <Text style={styles.entryTitle}>{title}</Text>
                      <Text style={styles.entryDate}>{date}</Text>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              );
            })
          )}
        </ScrollView>

        {/* Retângulo azul flutuante inferior */}
        <View style={styles.floatingBar}>
          <TouchableOpacity onPress={() => router.push("../newNote/NewNote")}>
            <Image
              source={require("../../../assets/icons/more.png")}
              style={styles.moreIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("../home/Home")}>
            <Image
              source={require("../../../assets/icons/homeImage.png")}
              style={styles.homeIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => userId && fetchEntries(userId)}>
            <Image
              source={require("../../../assets/icons/menudiario.png")}
              style={styles.rectIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Menu lateral */}
        {menuVisible && (
          <TouchableWithoutFeedback onPress={toggleMenu}>
            <View style={styles.overlay}>
              <Animated.View style={[styles.sideMenu, { left: slideAnim }]}>
                <View>
                  <TouchableOpacity onPress={toggleMenu}>
                    <Text style={styles.closeButton}>✖</Text>
                  </TouchableOpacity>

                  <Text style={styles.menuHeading}>Menu</Text>
                  <TouchableOpacity
                    onPress={() => router.push("../profile/Profile")}
                  >
                    <Text style={styles.menuOption}>Seu Perfil</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logout}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  menuIcon: { width: 28, height: 28 },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  content: { flex: 1, padding: 20 },

  entryCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#000A74",
  },
  entryTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4, color: "#000" },
  entryDate: { fontSize: 12, color: "#777" },

  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40, // espaço lateral suficiente para tocar
  },
  deleteIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    top: -5,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#f9f9f9",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  closeButton: { fontSize: 20, alignSelf: "flex-end", marginBottom: 20 },
  menuHeading: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  menuOption: { fontSize: 18, color: "#000A74", marginTop: 20 },
  logout: { color: "red", fontWeight: "bold", fontSize: 18, marginTop: 20 },

  floatingBar: {
    position: "absolute",
    bottom: 20,
    left: 80,
    right: 80,
    height: 60,
    backgroundColor: "#000A74",
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    elevation: 5,
  },
  moreIcon: { width: 18, height: 18, resizeMode: "contain" },
  homeIcon: { width: 35, height: 35, resizeMode: "contain" },
  rectIcon: { width: 100, height: 40, resizeMode: "contain" },
});
