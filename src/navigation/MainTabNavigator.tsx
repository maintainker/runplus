import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen, HistoryScreen, ProfileScreen} from '../screens';
import {MainTabParamList} from '../@types/navigation';
import RunPlusSvg from '../asset/svg';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          return (
            <RunPlusSvg
              name={route.name as 'Home' | 'History' | 'Profile'}
              color={color}
              size={24}
            />
          );
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 5, // Android 그림자
          shadowOpacity: 0.1, // iOS 그림자
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          marginHorizontal: 4,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{title: '홈1'}} />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{title: '기록'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: '프로필'}}
      />
    </Tab.Navigator>
  );
}
