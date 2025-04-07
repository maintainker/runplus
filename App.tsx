import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {
  ActivityDetailScreen,
  ActivityHistoryScreen,
  HomeScreen,
  ProfileScreen,
  RunTrackingScreen,
} from './src/screens';

// Types
export type RootStackParamList = {
  Home: undefined;
  RunTracking: undefined;
  ActivityHistory: undefined;
  ActivityDetail: {activityId: string};
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="RunTracking"
            component={RunTrackingScreen}
            options={{gestureEnabled: false}} // 트래킹 중 뒤로가기 방지
          />
          <Stack.Screen
            name="ActivityHistory"
            component={ActivityHistoryScreen}
          />
          <Stack.Screen
            name="ActivityDetail"
            component={ActivityDetailScreen}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
