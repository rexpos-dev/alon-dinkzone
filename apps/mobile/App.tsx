import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DiscoverScreen from './src/screens/DiscoverScreen';
import MyClubsScreen from './src/screens/MyClubsScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Tab layout mirrors Reclub's mental model: Discover / My Clubs / Activity / Profile.
// See the project's PRD (§3 Target Users) and Technical Architecture (§3 Mobile App Architecture) docs.
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Discover" component={DiscoverScreen} />
        <Tab.Screen name="My Clubs" component={MyClubsScreen} />
        <Tab.Screen name="Activity" component={ActivityScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
