import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, ToastAndroid, StatusBar } from 'react-native';
import Search from '../components/Search';
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Card from "../components/Card";
import { OPEN_WEATHER_API_KEY } from "@env";

export default function LocationDetailsScreen({ route, navigation }) {
  const { location } = route.params;
  const [weatherData, setWeatherData] = useState(null);
  const [loaded, setLoaded] = useState(true);
  const [favorites, setFavorites] = useState([]);

  async function fetchWeatherData(cityName) {
    setLoaded(false);
    const API = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
    try {
      const response = await fetch(API);
      if (response.status == 200) {
        const data = await response.json();
        setWeatherData(data);
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
  let weatherImage;
  let weatherBgColor;
  let weatherDescription;
  let barColor;

  switch (condition) {
    case "Clear":
      weatherImage = require("../assets/images/sea_sunnypng.png");
      weatherBgColor = "#47AB2F";
      weatherDescription = "SUNNY";
      barColor = "#ffd5a0";
      break;
    case "Clouds":
      weatherImage = require("../assets/images/sea_cloudy.png");
      weatherBgColor = "#54717A";
      weatherDescription = "CLOUDY";
      barColor = "#5f8498";
      break;
    case "Rain":
      weatherImage = require("../assets/images/sea_rainy.png");
      weatherBgColor = "#57575DF";
      weatherDescription = "RAINY";
      barColor = "#757575";
      break;
    default:
      weatherImage = require("../assets/images/sea_sunnypng.png");
      weatherBgColor = "#47AB2F";
      weatherDescription = "SUNNY";
      barColor = "#ffd5a0";
      break;
  }

  const {
    weather,
    name,
    main: { temp, temp_max, temp_min, humidity },
    wind: { speed },
    sys: { sunrise, sunset }
  } = weatherData;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={barColor} />
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
      <View style={[styles.cardContainer, { backgroundColor: weatherBgColor }]}>
        <Text style={styles.subtitle}>Feels like</Text>
        <View style={styles.cardRow}>
          <Card style={styles.card}>
            <Text>Max Temp</Text>
            <Text>{Math.round(temp_max)}°</Text>
          </Card>
          <Card style={styles.card}>
            <Text>Min Temp</Text>
            <Text>{Math.round(temp_min)}°</Text>
          </Card>
        </View>
        <View style={styles.cardRow}>
          <Card style={styles.card}>
            <Text>Wind</Text>
            <Text>{speed} m/s</Text>
          </Card>
          <Card style={styles.card}>
            <Text>Humidity</Text>
            <Text>{humidity}%</Text>
          </Card>
        </View>
        <View style={styles.cardRow}>
          <Card style={styles.card}>
            <Text>Sunrise</Text>
            <Text>{formatTime(sunrise)}</Text>
          </Card>
          <Card style={styles.card}>
            <Text>Sunset</Text>
            <Text>{formatTime(sunset)}</Text>
          </Card>
        </View>
      
      <TouchableOpacity
        style={styles.roundedButton}
        onPress={() => navigation.navigate("Map", { locationName: name })}
      >
        <FontAwesome name="map" size={20} color="white" />
        <Text style={styles.buttonText}>View on Map</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: "white",
    marginRight: 15,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  card: {
    flex: 1,
    padding: 20,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  roundedButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 15,
    backgroundColor: "#e96e50",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
