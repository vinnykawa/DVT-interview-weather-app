import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './components/CustomSidebarMenu';
import { NavigationContainer } from "@react-navigation/native";
import LocationsScreen from './screens/locations';
import HomeScreen from './screens/home';
import Ionicons from '@expo/vector-icons/Ionicons';


const Drawer = createDrawerNavigator();

function MyDrawer() {
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
          drawerLabel: "Locations",
          headerShown: false,
          drawerIcon: ({ size, color }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
        }}
        component={LocationsScreen}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
   <NavigationContainer>
    <MyDrawer />
   </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
