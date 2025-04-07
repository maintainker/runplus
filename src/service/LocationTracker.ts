// services/LocationTracker.ts
import Geolocation from 'react-native-geolocation-service';

let watchId: number | null = null;
let route: LocationPoint[] = [];

// 속도(km/h)에 따른 기록 간격 계산 (단위: 미터)
const getDistanceFilter = (speed: number | null): number => {
  if (!speed) return 5; // 기본값 (정지 상태)

  const speedKmh = speed * 3.6; // m/s → km/h 변환
  if (speedKmh < 5) return 5; // 걷기: 5m
  if (speedKmh < 20) return 10; // 조깅: 10m
  return 20; // 달리기/사이클링: 20m
};

export const startTracking = (onUpdate: (newPoint: LocationPoint) => void) => {
  let lastPoint: LocationPoint | null = null;

  watchId = Geolocation.watchPosition(
    position => {
      const newPoint: LocationPoint = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        speed: position.coords.speed,
        timestamp: position.timestamp,
      };

      // 첫 점이거나 충분히 이동했을 때만 기록
      if (!lastPoint || shouldRecord(lastPoint, newPoint)) {
        route.push(newPoint);
        onUpdate(newPoint);
        lastPoint = newPoint;
      }
    },
    error => console.error(error),
    {
      enableHighAccuracy: true,
      distanceFilter: 0, // 동적 계산을 위해 0으로 설정
      interval: 1000, // iOS 최소 업데이트 간격 (1초)
    },
  );
};

// 두 지점 간 거리 계산 (Haversine 공식)
const getDistance = (pointA: LocationPoint, pointB: LocationPoint): number => {
  const R = 6371e3; // 지구 반지름 (미터)
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

// 기록 여부 결정 (동적 간격 적용)
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
