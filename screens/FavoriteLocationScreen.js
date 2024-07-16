import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Card from "../components/Card";

export default function FavoriteLocationScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getFavorites = async () => {
    try {
      const favs = await AsyncStorage.getItem("favs");
      if (favs !== null) {
        setFavorites(JSON.parse(favs));
      }
    } catch (error) {
      console.log("Error getting favorites!", error);
    }
    setLoaded(true);
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("LocationDetails", { location: item.location, navigation })}
    >
      <Card>
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>{item.location}</Text>
          <Text style={styles.cardText}>{item.temperature}°</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  useEffect(() => {
    onRefresh()
  }, [favorites]);

  const onRefresh = () => {
    getFavorites();
  };

  if (!loaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="gray" size={36} />
      </View>
    );
  } else if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.primaryText}>
          No favorites added.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textStyle}>Favorite Locations</Text>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.location}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: "#5f8498",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  cardText: {
    fontSize: 20,
  },
  textStyle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    paddingVertical: 10,
  },
  primaryText: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
});
