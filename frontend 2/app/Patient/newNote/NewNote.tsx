import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

export default function NewNote() {
  const router = useRouter(); // Inicialize o router
  const { id } = useLocalSearchParams(); // Use useLocalSearchParams para acessar o id
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (id) fetchEntry(id as string); // Certifique-se de que o id seja uma string
  }, [id]);

  const fetchEntry = async (entryId: string) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const res = await axios.get(`http://localhost:3000/diary/list/${userId}`);
      const entry = res.data.find((e: any) => e.id == entryId);

      if (entry) {
        const lines = entry.content.split("\n\n");
        setTitle(lines[0] || "");
        setContent(lines.slice(1).join("\n\n") || "");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível carregar a nota.");
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Aviso", "Digite um título e um conteúdo antes de salvar.");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
        return;
      }

      const fullContent = `${title}\n\n${content}`;

      if (id) {
        // Edição
        await axios.put(`http://localhost:3000/diary/update/${id}`, {
          user_id: userId,
          content: fullContent,
        });
        Alert.alert("Sucesso", "Nota atualizada!");
      } else {
        // Criação
        await axios.post("http://localhost:3000/diary/create", {
          user_id: userId,
          content: fullContent,
        });
        Alert.alert("Sucesso", "Nota criada!");
      }

      setTitle("");
      setContent("");
      router.replace("../homeDiary/HomeDiary"); // volta para lista
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível salvar a nota.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../../../assets/icons/back.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

      {/* Título */}
      <TextInput
        style={styles.titleInput}
        placeholder="Título da nota..."
        placeholderTextColor="#A8A8A8"
        value={title}
        onChangeText={setTitle}
      />

      {/* Conteúdo */}
      <TextInput
        style={styles.input}
        placeholder="Estou me sentindo..."
        placeholderTextColor="#A8A8A8"
        multiline
        value={content}
        onChangeText={setContent}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSave}>
          <Image
            source={require("../../../assets/icons/confirm.png")}
            style={styles.ImageConfirm}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  header: { flexDirection: "row", paddingHorizontal: 20, alignItems: "center" },
  icon: { width: 28, height: 28, resizeMode: "contain" },
  line: {
    height: 1,
    backgroundColor: "#A8A8A8",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  titleInput: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  input: {
    flex: 1,
    marginHorizontal: 20,
    fontSize: 16,
    textAlignVertical: "top",
    color: "#000",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    height: 60,
    backgroundColor: "#000A74",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  ImageConfirm: { width: 20, height: 20, resizeMode: "contain" },
});