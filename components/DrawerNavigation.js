import React from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from "./CustomSidebarMenu";
import Ionicons from '@expo/vector-icons/Ionicons';
import FavoriteLocationScreen from "../screens/FavoriteLocationScreen";
import HomeScreen from "../screens/HomeScreen";



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
            drawerIcon: ({ size, color }) => (
              <Ionicons name="location-outline" size={size} color={color} />
            ),
          }}
          component={FavoriteLocationScreen}
        />
      </Drawer.Navigator>
    );
  }