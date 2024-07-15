import React from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from "./CustomSidebarMenu";
import Ionicons from '@expo/vector-icons/Ionicons';
import LocationScreen from "../screens/favoriteLocations";
import HomeScreen from "../screens/home";


const Drawer = createDrawerNavigator();

export default function MyDrawer() {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="Home"
          options={{
            drawerLabel: "Home",
            headerShown: false,
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
          component={HomeScreen}
        />
        <Drawer.Screen
          name="Locations"
          options={{
            drawerLabel: "Favorite Locations",
            headerTintColor: "#5f8498",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="location-outline" size={size} color={color} />
            ),
          }}
          component={LocationScreen}
        />
      </Drawer.Navigator>
    );
  }