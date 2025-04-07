import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, ScrollView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../App';
import {startTracking, stopTracking} from '../../service/LocationTracker';
import {requestLocationPermission} from '../../util/PermissionUtils';
import {RESULTS} from 'react-native-permissions';

// 임시로 모든 화면 접근 가능하게 설정
type Props = NativeStackScreenProps<
  RootStackParamList,
  'Home' | 'RunTracking' | 'ActivityHistory' | 'ActivityDetail' | 'Profile'
>;
// type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({navigation}: Props) => {
  const [isTracking, setIsTracking] = useState(false);
  const [locationData, setLocationData] = useState<LocationPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (isTracking) {
        stopTracking();
      }
    };
  }, [isTracking]);

  const handleStartTracking = async () => {
    const permissionStatus = await requestLocationPermission();

    if (permissionStatus === RESULTS.GRANTED) {
      setIsTracking(true);
      setLocationData([]);

      startTracking(newLocation => {
        setCurrentLocation(newLocation);
        setLocationData(prev => [...prev, newLocation]);
      });
    } else {
      console.warn('Location permission denied');
    }
  };

  const handleStopTracking = () => {
    const finalRoute = stopTracking();
    setIsTracking(false);
    console.log('Final route:', finalRoute);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RunPlus Tracking Test</Text>

      <View style={styles.controls}>
        {!isTracking ? (
          <Button
            title="Start Tracking"
            onPress={handleStartTracking}
            color="#2ecc71"
          />
        ) : (
          <Button
            title="Stop Tracking"
            onPress={handleStopTracking}
            color="#e74c3c"
          />
        )}
      </View>

      <View style={styles.currentData}>
        <Text style={styles.sectionTitle}>Current Location:</Text>
        <Text style={styles.dataText}>
          {currentLocation
            ? `Lat: ${currentLocation.latitude.toFixed(
                5,
              )}, Lng: ${currentLocation.longitude.toFixed(5)}`
            : 'No data'}
        </Text>
        <Text style={styles.dataText}>
          Speed:{' '}
          {currentLocation?.speed
            ? `${(currentLocation.speed * 3.6).toFixed(1)} km/h`
            : 'N/A'}
        </Text>
      </View>

      <ScrollView style={styles.dataContainer}>
        <Text style={styles.sectionTitle}>Location History:</Text>
        {locationData.map((loc, index) => (
          <View key={index} style={styles.dataItem}>
            <Text style={styles.dataText}>
              #{index + 1}: {loc.latitude.toFixed(5)},{' '}
              {loc.longitude.toFixed(5)}
            </Text>
            <Text style={styles.dataSubText}>
              Speed: {((loc.speed ?? 0) * 3.6).toFixed(1)} km/h | Time:{' '}
              {new Date(loc.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  controls: {
    marginBottom: 20,
  },
  currentData: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  dataContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#3498db',
  },
  dataItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dataText: {
    fontSize: 14,
    color: '#333',
  },
  dataSubText: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
});

export default HomeScreen;
