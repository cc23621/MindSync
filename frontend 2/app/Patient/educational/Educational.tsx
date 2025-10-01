import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import api from "../../../service/api";

interface Content {
  id: number;
  title: string;
  description: string;
  type: string;
  url: string;
  created_at?: string;
}

export default function ProfilePatient() {
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>(""); 
  const [contents, setContents] = useState<Content[]>([]);


  useEffect(() => {
    const fetchContents = async () => {
      try {
        const url = selectedType
          ? `/contents/filter?type=${selectedType}`
          : "/contents";
        const response = await api.get(url);
        setContents(response.data);
      } catch (error) {
        console.error("Erro ao buscar conteúdos:", error);
      }
    };
    fetchContents();
  }, [selectedType]);

  const handleSelectFilter = (type: string) => {
    setSelectedType(type);
    setFilterOpen(false);
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Image
            source={require("../../../assets/icons/back.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/icons/logo.png")}
            style={styles.logo}
            resizeMode="cover"
          />
          <View style={styles.logoTextContainer}>
            <Text style={styles.mind}>Mind</Text>
            <Text style={styles.sync}>Sync</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Image
            source={require("../../../assets/icons/menu.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>


      <View style={styles.subHeader}>
        <Text style={styles.suggestionText}>Sugestões para você</Text>

        <View>
          <TouchableOpacity
            style={styles.filterBox}
            onPress={() => setFilterOpen(!filterOpen)}
          >
            <Text style={styles.filterText}>
              {selectedType ? selectedType : "Filtrar"}
            </Text>
            <Image
              source={require("../../../assets/icons/arrowdown.png")}
              style={styles.filterIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Dropdown */}
          {filterOpen && (
            <View style={styles.dropdown}>
              <TouchableOpacity onPress={() => handleSelectFilter("")}>
                <Text style={styles.dropdownItem}>Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelectFilter("article")}>
                <Text style={styles.dropdownItem}>Artigos</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelectFilter("video")}>
                <Text style={styles.dropdownItem}>Vídeos</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelectFilter("podcast")}>
                <Text style={styles.dropdownItem}>Podcast</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={{ marginTop: 10 }}>
        {contents.map((content) => (
          <View key={content.id} style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {content.title}
            </Text>
            <Text>{content.description}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(content.url)}>
              <Text style={{ color: "blue", marginTop: 5 }}>Ver mais</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  iconButton: {
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginLeft: -10,
  },
  logoTextContainer: {
    marginLeft: 8,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  mind: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#41BECE",
    lineHeight: 20,
  },
  sync: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#529DFF",
    lineHeight: 20,
  },
  subHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 50,
    marginBottom: 10,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  filterBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#A1A1A1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  filterText: {
    fontSize: 14,
    color: "#A1A1A1",
    marginRight: 5,
  },
  filterIcon: {
    width: 16,
    height: 16,
    tintColor: "#A1A1A1",
  },
  dropdown: {
    marginTop: 5,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#A1A1A1",
    borderRadius: 6,
    padding: 8,
  },
  dropdownItem: {
    fontSize: 14,
    color: "#A1A1A1",
    paddingVertical: 4,
  },
});
