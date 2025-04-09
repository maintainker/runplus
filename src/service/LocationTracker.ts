import Geolocation, {
  GeoPosition,
  GeoError,
} from 'react-native-geolocation-service';

let watchId: number | null = null;
let route: LocationPoint[] = [];

const getDistanceFilter = (speed: number | null): number => {
  if (!speed) return 5;

  const speedKmh = speed * 3.6;
  if (speedKmh < 5) return 5;
  if (speedKmh < 20) return 10;
  return 20;
};

export const startTracking = (onUpdate: (newPoint: LocationPoint) => void) => {
  let lastPoint: LocationPoint | null = null;
  route = [];

  watchId = Geolocation.watchPosition(
    position => {
      const newPoint: LocationPoint = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        speed: position.coords.speed,
        timestamp: position.timestamp,
      };

      if (!lastPoint || shouldRecord(lastPoint, newPoint)) {
        route.push(newPoint);
        onUpdate(newPoint);
        lastPoint = newPoint;
      }
    },
    error => console.error(error),
    {
      enableHighAccuracy: true,
      distanceFilter: 0,
      interval: 1000,
    },
  );
};

const getDistance = (pointA: LocationPoint, pointB: LocationPoint): number => {
  const R = 6371e3;
  const φ1 = (pointA.latitude * Math.PI) / 180;
  const φ2 = (pointB.latitude * Math.PI) / 180;
  const Δφ = ((pointB.latitude - pointA.latitude) * Math.PI) / 180;
  const Δλ = ((pointB.longitude - pointA.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const shouldRecord = (
  lastPoint: LocationPoint,
  newPoint: LocationPoint,
): boolean => {
  const distance = getDistance(lastPoint, newPoint);
  const requiredDistance = getDistanceFilter(lastPoint.speed);
  return distance >= requiredDistance;
};

export const stopTracking = () => {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
  }
  return route;
};

export const calculateDistance = (route: LocationPoint[]): number => {
  let total = 0;
  for (let i = 1; i < route.length; i++) {
    const prev = route[i - 1];
    const curr = route[i];
    total += getDistance(prev, curr);
  }
  return total;
};

export const getCurrentLocation = (
  onSuccess: (position: GeoPosition) => void,
  onError: (error: GeoError) => void,
) => {
  console.log('getCurrentLocation');
  Geolocation.getCurrentPosition(
    position => {
      console.log('position', position);
      onSuccess(position);
    },
    error => {
      console.log('error', error);
      onError(error);
    },

    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
    },
  );
};
