import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../../service/api";

interface Paciente {
  id: number;
  nome: string;
  email: string;
}

export default function HomePsy() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await api.get("/auth/users"); 
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      }
    };

    fetchPacientes();
  }, []);

  const handleViewProfile = (id: number) => {
    router.push(`/Psychologist/ProfilePatient/ProfilePatient?id=${id}`);
  };

  return (
    <ScrollView style={styles.container}>
   
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push("../menu/Menu")}
      >
        <Image
          source={require("../../../assets/icons/menu.png")}
          style={styles.menuIcon}
        />
      </TouchableOpacity>

      
      <View style={styles.header}>
        <Text style={styles.olaText}>Olá</Text>
        <Text style={styles.bemVindoText}>
          Bem vindo(a) à sua área profissional
        </Text>
      </View>


      <View style={styles.imagesContainer}>
        <Image
          source={require("../../../assets/explore/img1.png")}
          style={styles.image}
        />
        <Image
          source={require("../../../assets/explore/img4.png")}
          style={styles.image}
        />
      </View>


      <Text style={styles.seusPacientesText}>Seus pacientes</Text>
      <View style={styles.pacientesList}>
        {pacientes.map((paciente) => (
          <View key={paciente.id} style={styles.pacienteCard}>
            <Text style={styles.pacienteName}>{paciente.nome}</Text>
            <TouchableOpacity
              style={styles.verPerfilButton}
              onPress={() => handleViewProfile(paciente.id)}
            >
              <Text style={styles.verPerfilText}>Ver perfil</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  menuButton: {
    position: "absolute",
    top: 10,
    zIndex: 10,
  },
  menuIcon: {
    width: 30,
    height: 30,
    tintColor: "#000",
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
  },
  olaText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  bemVindoText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  image: {
    width: "45%",
    height: 160,
    borderRadius: 10,
    resizeMode: "cover",
  },
  seusPacientesText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginTop: 30,
    marginBottom: 10,
  },
  pacientesList: {
    marginBottom: 40,
  },
  pacienteCard: {
    backgroundColor: "#9166FF33", 
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pacienteName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000", 
  },
  verPerfilButton: {
    backgroundColor: "#000A74",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  verPerfilText: {
    color: "#FFFF",
    fontWeight: "bold",
  },
});