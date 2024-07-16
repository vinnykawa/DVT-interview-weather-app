import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ImageBackground,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  Keyboard,
} from "react-native";
import * as Location from "expo-location";
import CustomDrawerToggle from "../components/DrawerToggleIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OPEN_WEATHER_API_KEY } from "@env";
import Search from "../components/Search";

const HomeScreen = ({ navigation }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loaded, setLoaded] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const loadForecast = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude: lat, longitude: lon } = location.coords;

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPEN_WEATHER_API_KEY}`
      );
      const weatherData = await weatherResponse.json();
      if (!weatherResponse.ok) {
        Alert.alert(`Error retrieving weather data: ${weatherData.message}`);
        return;
      }
      setCurrentWeather(weatherData);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPEN_WEATHER_API_KEY}`
      );
      const forecastData = await forecastResponse.json();
      if (!forecastResponse.ok) {
        Alert.alert(`Error retrieving weather data: ${forecastData.message}`);
        return;
      }
      setForecast(forecastData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  async function fetchWeatherData(cityName) {
    setLoaded(false);
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${OPEN_WEATHER_API_KEY}`
      );
      const weatherData = await weatherResponse.json();
      if (!weatherResponse.ok) {
        Alert.alert(`Error retrieving weather data: ${weatherData.message}`);
        setLoaded(true);
        return;
      }

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${OPEN_WEATHER_API_KEY}`
      );
      const forecastData = await forecastResponse.json();
      if (!forecastResponse.ok) {
        Alert.alert(`Error retrieving weather data: ${forecastData.message}`);
        setLoaded(true);
        return;
      }

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setLoaded(true);
      Keyboard.dismiss(); 
    } catch (error) {
      console.error(error);
      setLoaded(true);
    }
  }

  const addFavorite = async () => {
    if (currentWeather) {
      const {
        name,
        main: { temp },
      } = currentWeather;
      const favItem = { location: name, temperature: Math.round(temp) };

      function containsObject(obj, list) {
        return list.some(item => item.location === obj.location);
      }

      // Get the existing favorites from AsyncStorage
      const favs = await AsyncStorage.getItem("favs");
      let updatedFavorites = favs ? JSON.parse(favs) : [];

      // Check if the new favorite already exists
      if (!containsObject(favItem, updatedFavorites)) {
        updatedFavorites.push(favItem);
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem("favs", JSON.stringify(updatedFavorites));
        ToastAndroid.show(name + " added to favorites", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(name + " already added to favorites", ToastAndroid.SHORT);
      }
    }
  };

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
  };

  useEffect(() => {
    loadForecast();
    getFavorites(); 
  }, [loadForecast]);

  if (!forecast || !currentWeather) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const currentTemp = Math.round(currentWeather.main.temp);
  const maxTemp = Math.round(currentWeather.main.temp_max);
  const minTemp = Math.round(currentWeather.main.temp_min);
  const description = currentWeather.weather[0].main;
  const currentLocation = currentWeather.name;

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const today = new Date().getDay();

  const listData = forecast.list.reduce((acc, d, index) => {
    const dayName = daysOfWeek[new Date(d.dt * 1000).getDay()];
    if (
      today !== new Date(d.dt * 1000).getDay() &&
      !acc.some((item) => item.day === dayName)
    ) {
      acc.push({
        id: index.toString(),
        day: dayName,
        temp: Math.round(d.main.temp_max),
      });
    }
    return acc;
  }, []);

  let weatherImage, weatherBgColor, weatherDescription, barColor;
  switch (description) {
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
  }

  const renderItem = ({ item }) => {
    let listWeatherIcon;
    const dailyCondition = forecast.list.find(
      (c) => new Date(c.dt * 1000).getDay() === new Date().getDay()
    );

    if (dailyCondition) {
      switch (dailyCondition.weather[0].main) {
        case "Clear":
          listWeatherIcon = require("../assets/icons/clear.png");
          break;
        case "Clouds":
          listWeatherIcon = require("../assets/icons/partlysunny.png");
          break;
        case "Rain":
          listWeatherIcon = require("../assets/icons/rain.png");
          break;
        default:
          listWeatherIcon = require("../assets/icons/clear.png");
      }
    }

    return (
      <View style={styles.renderItemStyle}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontSize: 18 }}>
            {item.day}
          </Text>
        </View>
        <Image
          resizeMode="contain"
          source={listWeatherIcon}
          style={{ height: 40, width: 40 }}
        />
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text style={{ color: "white", fontSize: 18 }}>{item.temp}°</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: barColor }}>
        <Search style={{ marginBottom: 50 }} fetchWeatherData={fetchWeatherData} />
      </View>
      <StatusBar translucent backgroundColor={barColor} />
      <ImageBackground
        resizeMode="stretch"
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: weatherBgColor,
        }}
        source={weatherImage}
      >
        <View style={{flex:1, alignItems: "center"}}>
        <View
          style={{
            alignSelf: "flex-start",
            marginTop: 40,
            marginStart: 10,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View style={{alignSelf: "flex-start", marginRight: 70}}>
          <CustomDrawerToggle   navigationProps={navigation} />
          </View>
          <Text style={styles.drawerToggleStyle}>{currentLocation}</Text>
          <Ionicons
            name="location-sharp"
            size={20}
            color="#fff"
            style={{ marginBottom: 30 }}
          />
          <TouchableOpacity style={{ marginStart: 90 }} onPress={addFavorite}>
            <FontAwesome
              name="heart"
              size={28}
              color="red"
            />
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 50 }}>
          <Text style={{ fontSize: 60, fontWeight: "bold", color: "white" }}>
            {currentTemp}°
          </Text>
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
            {weatherDescription}
          </Text>
        </View>
        </View>
      </ImageBackground>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: weatherBgColor,
          padding: 5,
          paddingHorizontal: 20,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "column", alignContent: "center" }}>
          <Text style={styles.currentTemps}>{minTemp}°</Text>
          <Text style={styles.currentTempsTxt}>min</Text>
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.currentTemps}>{currentTemp}°</Text>
          <Text style={styles.currentTempsTxt}>Current</Text>
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.currentTemps}>{maxTemp}°</Text>
          <Text style={styles.currentTempsTxt}>max</Text>
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: "white" }}></View>
      <View style={{ flex: 1, backgroundColor: weatherBgColor }}>
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  loading: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  renderItemStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    alignItems: "center",
  },
  currentTemps: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  currentTempsTxt: {
    color: "white",
    fontSize: 18,
  },
  drawerToggleStyle: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    fontSize: 18,
    padding: 2,
    marginBottom: 30,
    marginStart: 15,
  },
});

export default HomeScreen;
