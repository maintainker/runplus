import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import RunPlusSvg from '../asset/svg';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList, RootStackParamList} from '../@types/navigation';
import {HistoryScreen, ProfileScreen, HomeScreen} from '../screens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator<MainTabParamList>();

const Stack = createNativeStackNavigator();

export default function MainTabNavigator() {
  const {isLoggedIn} = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // 프로필 탭의 screenOptions를 동적으로 설정
  const getScreenOptions = ({route}: {route: any}) => {
    const defaultOptions = {
      tabBarIcon: ({color, size}: {color: string; size: number}) => (
        <RunPlusSvg
          name={route.name as 'Home' | 'History' | 'Profile'}
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
        name="History"
        component={HistoryScreen}
        options={{title: '기록'}}
      />
      <Tab.Screen
        listeners={{
          tabPress: e => {
            e.preventDefault();
            console.log('tabPress', isLoggedIn);
            if (!isLoggedIn) {
              console.log('login');
              navigation.navigate('Login');
            }
          },
        }}
        name="Profile"
        component={ProfileScreen}
        options={{title: '프로필'}}
      />
    </Tab.Navigator>
  );
}
