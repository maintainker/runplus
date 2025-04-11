import {NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../@types/navigation';

type Navigation = NavigationProp<RootStackParamList>;

const navigateHandler = (navigation: Navigation, payload: unknown) => {
  console.log(payload);
};

const navigateBackHandler = (navigation: Navigation) => {
  navigation.goBack();
};

const handlers = {
  NAVIGATE: navigateHandler,
  NAVIGATE_BACK: navigateBackHandler,
};

export default handlers;
