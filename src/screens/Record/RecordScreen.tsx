import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import {
  calculateDistance,
  getCurrentLocation,
  startTracking,
  stopTracking,
} from '../../service/LocationTracker';
import {RESULTS} from 'react-native-permissions';
import {requestLocationPermission} from '../../util/PermissionUtils';
import {saveActivity} from '../../service/StorageService';
import {useAuth} from '../../context/AuthContext';
let dummyCount = 0;
const dummyActivities = [
  {
    id: '1',
    route: [
      {
        latitude: 37.5665,
        longitude: 126.978,
        speed: 2.5,
        timestamp: 1736485200000,
      }, // 2025-01-10 10:00:00
      {
        latitude: 37.567,
        longitude: 126.9785,
        speed: 2.7,
        timestamp: 1736485260000,
      }, // 1분 후
      {
        latitude: 37.5675,
        longitude: 126.979,
        speed: 2.6,
        timestamp: 1736485320000,
      }, // 2분 후
    ],
    distance: 120.5, // 대략 120미터
    duration: 120, // 2분
    avgSpeed: 120.5 / 120, // 약 1.004 m/s
    timestamp: 1736485200000,
    date: '2025-01-10T10:00:00.000Z',
  },
  {
    id: '2',
    route: [
      {
        latitude: 37.555,
        longitude: 127.0,
        speed: 3.0,
        timestamp: 1736571600000,
      }, // 2025-01-11 10:00:00
      {
        latitude: 37.5558,
        longitude: 127.0005,
        speed: 3.2,
        timestamp: 1736571660000,
      },
      {
        latitude: 37.5566,
        longitude: 127.001,
        speed: 3.1,
        timestamp: 1736571720000,
      },
      {
        latitude: 37.5574,
        longitude: 127.0015,
        speed: 3.0,
        timestamp: 1736571780000,
      },
    ],
    distance: 200.0, // 대략 200미터
    duration: 180, // 3분
    avgSpeed: 200.0 / 180, // 약 1.111 m/s
    timestamp: 1736571600000,
    date: '2025-01-11T10:00:00.000Z',
  },
  {
    id: '3',
    route: [
      {
        latitude: 37.57,
        longitude: 126.99,
        speed: 2.8,
        timestamp: 1736658000000,
      }, // 2025-01-12 10:00:00
      {
        latitude: 37.5705,
        longitude: 126.9905,
        speed: 2.9,
        timestamp: 1736658060000,
      },
      {
        latitude: 37.571,
        longitude: 126.991,
        speed: 2.7,
        timestamp: 1736658120000,
      },
      {
        latitude: 37.5715,
        longitude: 126.9915,
        speed: 2.8,
        timestamp: 1736658180000,
      },
      {
        latitude: 37.572,
        longitude: 126.992,
        speed: 2.6,
        timestamp: 1736658240000,
      },
    ],
    distance: 300.0, // 대략 300미터
    duration: 240, // 4분
    avgSpeed: 300.0 / 240, // 약 1.25 m/s
    timestamp: 1736658000000,
    date: '2025-01-12T10:00:00.000Z',
  },
];

const RecordScreen = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(
    null,
  );
  const [route, setRoute] = useState<LocationPoint[]>([]);
  const mapRef = useRef<MapView>(null);
  const {user} = useAuth();

  const handleStartTracking = async () => {
    try {
      const permissionStatus = await requestLocationPermission();
      if (permissionStatus !== RESULTS.GRANTED) {
        Alert.alert(
          '위치 권한 필요',
          '러닝 기록을 위해 위치 권한이 필요합니다.',
        );
        return;
      }

      setIsTracking(true);
      setRoute([]);

      startTracking(newLocation => {
        setCurrentLocation(newLocation);
        setRoute(prevRoute => [...prevRoute, newLocation]);

        mapRef.current?.animateToRegion({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      });
    } catch (error) {
      Alert.alert('오류 발생', '위치 추적을 시작할 수 없습니다.');
      console.error(error);
    }
  };

  const handleStopTracking = async () => {
    try {
      // Alert.alert('기록 완료', '기록을 완료했습니다.' + user?.id);
      // return;
      // const finalRoute = stopTracking();
      const finalRoute = dummyActivities[dummyCount++].route;
      setIsTracking(false);

      if (finalRoute.length < 2) {
        Alert.alert('기록 부족', '충분한 이동 경로가 기록되지 않았습니다.');
        return;
      }

      const duration =
        (finalRoute[finalRoute.length - 1].timestamp -
          finalRoute[0].timestamp) /
        1000;
      const distance = calculateDistance(finalRoute);
      const avgSpeed = duration > 0 ? distance / duration : 0;

      const newActivity: Activity = {
        route: finalRoute,
        distance,
        duration,
        avgSpeed,
        timestamp: finalRoute[0].timestamp,
        date: new Date(finalRoute[0].timestamp).toISOString(),
      };

      await saveActivity(newActivity);
      Alert.alert(
        '기록 완료',
        `${distance.toFixed(2)}m 달리기를 기록했습니다!`,
      );
    } catch (error) {
      Alert.alert('기록 저장 오류:', (error as Error).message);
      // console.error('기록 저장 오류:', error);
    }
  };
  useEffect(() => {
    const fetchLocation = async () => {
      const permissionStatus = await requestLocationPermission();
      if (permissionStatus !== RESULTS.GRANTED) {
        Alert.alert(
          '위치 권한 필요',
          '러닝 기록을 위해 위치 권한이 필요합니다.',
        );
        return;
      }
      getCurrentLocation(
        position => {
          const {latitude, longitude} = position.coords;
          setCurrentLocation({
            latitude,
            longitude,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          });
        },
        error => {
          console.error(error);
          Alert.alert('위치 정보 오류', '위치 정보를 가져올 수 없습니다.');
        },
      );
    };
    fetchLocation();
  }, []);

  const toggleTracking = () => {
    isTracking ? handleStopTracking() : handleStartTracking();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.navbar}>
          <Text style={styles.runTitle}>Run</Text>
        </View>
      </SafeAreaView>

      {currentLocation ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={false}
          followsUserLocation={isTracking}>
          {route.length > 1 && (
            <Polyline
              coordinates={route}
              strokeColor="#3B82F6"
              strokeWidth={4}
            />
          )}

          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              anchor={{x: 0.5, y: 0.5}}>
              <View style={styles.userMarker}>
                <View style={styles.userMarkerInner} />
              </View>
            </Marker>
          )}
        </MapView>
      ) : (
        <Text style={styles.noLocation}>위치를 가져오는 중...</Text>
      )}

      <TouchableOpacity
        style={[styles.actionButton, isTracking && styles.stopButton]}
        onPress={toggleTracking}>
        <Text style={styles.actionButtonText}>
          {isTracking ? 'STOP' : 'START'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  runTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  map: {
    flex: 1,
  },
  noLocation: {
    fontSize: 18,
    color: '#888',
  },
  userMarker: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMarkerInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
  },
  actionButton: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecordScreen;
