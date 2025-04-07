import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';
import {Platform} from 'react-native';

type PermissionStatus = (typeof RESULTS)[keyof typeof RESULTS];

export const requestLocationPermission =
  async (): Promise<PermissionStatus> => {
    const permission = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    }) as Permission;

    const status = await check(permission);

    if (status === RESULTS.DENIED) {
      return await request(permission);
    }
    return status;
  };
