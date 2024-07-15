import 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import LocationDetailsScreen from './screens/locationDetails';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyDrawer from './components/DrawerNavigation';


const Stack = createNativeStackNavigator();


export default function App() {
  return (
   <NavigationContainer>
    <Stack.Navigator initialRouteName="Drawer">
      <Stack.Screen name='Drawer' component={MyDrawer} options={{headerShown: false}}/>
      <Stack.Screen name= 'LocationDetails' component={LocationDetailsScreen} />

    </Stack.Navigator>
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
