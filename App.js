import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen       from './screens/SplashScreen';
import LoginScreen        from './screens/LoginScreen';
import RegisterScreen     from './screens/RegisterScreen';
import HomeScreen         from './screens/HomeScreen';
import ArtisanHomeScreen  from './screens/ArtisanHomeScreen';
import SearchScreen       from './screens/SearchScreen';
import MessagesScreen     from './screens/MessagesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash"       component={SplashScreen}      />
        <Stack.Screen name="Login"        component={LoginScreen}       />
        <Stack.Screen name="Register"     component={RegisterScreen}    />
        <Stack.Screen name="Home"         component={HomeScreen}        />
        <Stack.Screen name="ArtisanHome"  component={ArtisanHomeScreen} />
        <Stack.Screen name="Search"       component={SearchScreen}      />
        <Stack.Screen name="Messages"     component={MessagesScreen}      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}