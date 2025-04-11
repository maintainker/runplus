import {NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../@types/navigation';

type Navigation = NavigationProp<RootStackParamList>;

// TODO: 추후 제작 예정
// const navigateHandler = (navigation: Navigation, payload: unknown) => {
//   const {screen, params} = payload as {
//     screen: keyof RootStackParamList;
//     params?: RootStackParamList[keyof RootStackParamList];
//   };
//   navigation.navigate(screen as keyof RootStackParamList);
// };

const navigateBackHandler = (navigation: Navigation) => {
  navigation.goBack();
};

const handlers = {
  // NAVIGATE: navigateHandler,
  NAVIGATE_BACK: navigateBackHandler,
};

export default handlers;
