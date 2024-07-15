import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, ToastAndroid } from 'react-native';
import Search from '../components/Search';
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from 'react-native-maps';

const API_KEY = "8e62b436f4aee9bbb341843a666409ba";

export default function LocationDetails({ route }) {
  const { location } = route.params;
  const [weatherData, setWeatherData] = useState(null);
  const [loaded, setLoaded] = useState(true);
  const [favorites, setFavorites] = useState([]);

  async function fetchWeatherData(cityName) {
    setLoaded(false);
    const API = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;
    try {
      const response = await fetch(API);
      if (response.status == 200) {
        const data = await response.json();
        setWeatherData(data);
        console.log(data);
      }
      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  }

  const getFavorites = async () => {
    try {
      const favs = await AsyncStorage.getItem("favs");
      if (favs !== null) {
        setFavorites(JSON.parse(favs));
      }
      setLoaded(true);
    } catch (error) {
      console.log("Error getting favorites!", error);
    }
  };

  const addFavorite = async () => {
    if (weatherData) {
      const {
        name,
        main: { temp },
      } = weatherData;
      const favItem = { location: name, temperature: Math.round(temp) };

      function containsObject(obj) {
        var i;
        for (i = 0; i < favorites.length; i++) {
          if (favorites[i].location === obj.location) {
            favorites[i] = obj;
            return true;
          }
        }
        return false;
      }

      if (!containsObject(favItem)) {
        const updatedFavorites = [...favorites, favItem];
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem("favs", JSON.stringify(updatedFavorites));
        ToastAndroid.show(name + " added to favorites", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(name + " already added to favorites", ToastAndroid.SHORT);
      }
    }
  };

  useEffect(() => {
    fetchWeatherData(location);
    getFavorites();
  }, []);

  if (!loaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="gray" size={36} />
      </View>
    );
  } else if (weatherData === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Search fetchWeatherData={fetchWeatherData} />
        <Text style={styles.primaryText}>
          City Not Found! Try Different City
        </Text>
      </SafeAreaView>
    );
  }

  const condition = weatherData.weather[0].description;

  // Set Location's current Weather background image and description
  let weatherImage = require("../assets/images/forest_sunny.png");
  let weatherBgColor = "#47AB2F";
  let weatherDescription = "SUNNY";
  let barColor = "#ffd5a0";

  if (condition === "Clear") {
    weatherImage = require("../assets/images/forest_sunny.png");
    weatherBgColor = "#47AB2F";
    weatherDescription = "SUNNY";
    barColor = "#ffd5a0";
  } else if (condition === "Clouds") {
    weatherImage = require("../assets/images/forest_cloudy.png");
    weatherBgColor = "#54717A";
    weatherDescription = "CLOUDY";
    barColor = "#5f8498";
  } else if (condition === "Rain") {
    weatherImage = require("../assets/images/forest_rainy.png");
    weatherBgColor = "#57575DF";
    weatherDescription = "RAINY";
    barColor = "#757575";
  }

  const {
    weather,
    name,
    main: { temp },
  } = weatherData;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          resizeMode="stretch"
          style={{
            flex: 1,
          }}
          source={weatherImage}
        >
          <View style={{ alignItems: "center" }}>
            <Search fetchWeatherData={fetchWeatherData} />
            <View style={styles.searchBarstyle}>
              <Text style={styles.title}>{name}</Text>
              <TouchableOpacity>
                <FontAwesome
                  name="heart"
                  size={28}
                  color="red"
                  onPress={addFavorite}
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 50 }}>
              <Text
                style={{ fontSize: 60, fontWeight: "bold", color: "white" }}
              >
                {Math.round(temp)}°
              </Text>
              <Text
                style={{ fontSize: 30, fontWeight: "bold", color: "white" }}
              >
                {weatherDescription}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
      <View style={{ flex: 1 }}>
        <Text>More details</Text>
      </View>
      <View style={{ flex: 1 }}>
        <MapView style={styles.map}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
  searchBarstyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    color: "#e96e50",
    marginRight: 15,
  },
  map: {
    width: '100%',
    height: '50%',
  },
});
