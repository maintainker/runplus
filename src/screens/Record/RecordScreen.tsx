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
import RunPlusSvg from '../../asset/svg';
import {
  calculateDistance,
  getCurrentLocation,
  startTracking,
  stopTracking,
} from '../../service/LocationTracker';
import {RESULTS} from 'react-native-permissions';
import {requestLocationPermission} from '../../util/PermissionUtils';
import {saveActivity} from '../../service/StorageService';

const RecordScreen = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(
    null,
  );
  const [route, setRoute] = useState<LocationPoint[]>([]);
  const mapRef = useRef<MapView>(null);

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
      const finalRoute = stopTracking();
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
        id: Date.now().toString(),
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
      console.error('기록 저장 오류:', error);
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
