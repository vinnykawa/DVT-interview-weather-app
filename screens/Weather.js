import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Search from "./Search";
import Card from "./Card";

export default function Weather({ weatherData, fetchWeatherData, navigation }) {
  const { weather, name, main: { temp } } = weatherData;
  const [{ main }] = weather;

  const favItem = { location: name, temperature: Math.round(temp) };
  const [favorites, setFavorites] = useState([]);

  const getFavorites = async () => {
    try {
      const favs = await AsyncStorage.getItem("favs");
      if (favs !== null) setFavorites(JSON.parse(favs));
    } catch (error) {
      console.log("Error getting favorites!", error);
    }
  };

  const addFavorite = async () => {
    const containsObject = (obj) => favorites.some(fav => fav.location === obj.location);

    if (!containsObject(favItem)) {
      const newFavorites = [...favorites, favItem];
      await AsyncStorage.setItem("favs", JSON.stringify(newFavorites));
      setFavorites(newFavorites);
      ToastAndroid.show(`${name} added to favorites`, ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(`${name} already added to favorites`, ToastAndroid.SHORT);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("LocationDetails", { location: item.location })}>
      <Card>
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>{item.location}</Text>
          <Text style={styles.cardText}>{item.temperature}°</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textStyle}>Favorite Locations</Text>
      <FlatList data={favorites} renderItem={renderItem} keyExtractor={(item) => item.location} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: "#5f8498"
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  cardText: {
    fontSize: 20
  },
  textStyle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    paddingVertical: 10
  },
});
