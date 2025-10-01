import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("usuario@email.com");
  const [password, setPassword] = useState("********");
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const carregarUsuario = async () => {
      const nome = await AsyncStorage.getItem("userName");
      if (nome) setUserName(nome);
    };
    carregarUsuario();
  }, []);

  const handleEdit = () => {
    setEditable(!editable);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push("../home/Home")}>
          <Image source={require("../../../assets/icons/back.png")} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.title}>Perfil do Usuário</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={[styles.input, editable && styles.inputEditable, { color: editable ? "#000" : "#C2BDBD" }]}
            value={userName}
            editable={editable}
            underlineColorAndroid="#C2BDBD"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={[styles.input, editable && styles.inputEditable, { color: editable ? "#000" : "#C2BDBD" }]}
            value={userEmail}
            editable={editable}
            underlineColorAndroid="#C2BDBD"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Senha:</Text>
          <TextInput
            style={[styles.input, editable && styles.inputEditable, { color: editable ? "#000" : "#C2BDBD" }]}
            value={password}
            editable={editable}
            secureTextEntry
            underlineColorAndroid="#C2BDBD"
          />
        </View>
      </ScrollView>

      {/* Footer com botões */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Excluir Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
          <Text style={styles.editText}>{editable ? "Cancelar" : "Editar Conta"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backIcon: {
    width: 30,
    height: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  field: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#C2BDBD",
    fontSize: 16,
    paddingVertical: 6,
  },
  inputEditable: {
    borderBottomColor: "#000A74",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "red",
    paddingVertical: 14,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#000A74",
    paddingVertical: 14,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  editText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
