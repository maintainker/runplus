import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import RunPlusSvg from '../asset/svg';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList, RootStackParamList} from '../@types/navigation';
import {HomeScreen, RecordScreen, SettingScreen} from '../screens';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const {isLoggedIn} = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const getScreenOptions = ({route}: {route: any}) => {
    const defaultOptions = {
      tabBarIcon: ({color, size}: {color: string; size: number}) => (
        <RunPlusSvg
          name={route.name as 'Home' | 'Record' | 'Profile'}
          color={color}
          size={24}
        />
      ),
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 0,
        elevation: 5,
        shadowOpacity: 0.1,
        paddingTop: 5,
      },
      tabBarLabelStyle: {
        marginHorizontal: 4,
      },
      tabBarActiveTintColor: '#3B82F6',
      tabBarInactiveTintColor: 'gray',
    };

    return defaultOptions;
  };

  return (
    <Tab.Navigator screenOptions={getScreenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} options={{title: '홈'}} />
      <Tab.Screen
        name="Record"
        component={RecordScreen}
        options={{title: '기록', headerShown: false}}
      />
      <Tab.Screen
        listeners={{
          tabPress: e => {
            if (!isLoggedIn) {
              e.preventDefault();
              navigation.navigate('Login');
            }
          },
        }}
        name="Profile"
        component={SettingScreen}
        options={{title: '프로필', headerShown: false}}
      />
    </Tab.Navigator>
  );
}
