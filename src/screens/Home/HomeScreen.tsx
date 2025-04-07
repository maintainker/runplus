import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, ScrollView, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../App';
import {startTracking, stopTracking} from '../../service/LocationTracker';
import {requestLocationPermission} from '../../util/PermissionUtils';
import {RESULTS} from 'react-native-permissions';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({navigation}: Props) => {
  const [isTracking, setIsTracking] = useState(false);
  const [locationData, setLocationData] = useState<LocationPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(
    null,
  );
  const [savedActivities, setSavedActivities] = useState<Activity[]>([]);

  // Load saved activities on mount
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const stored = await AsyncStorage.getItem('@activities');
      if (stored) setSavedActivities(JSON.parse(stored));
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  };

  const handleStartTracking = async () => {
    const permissionStatus = await requestLocationPermission();
    if (permissionStatus !== RESULTS.GRANTED) {
      Alert.alert('Permission Required', 'Location permission is needed');
      return;
    }

    setIsTracking(true);
    setLocationData([]);

    startTracking(newLocation => {
      setCurrentLocation(newLocation);
      setLocationData(prev => [...prev, newLocation]);
    });
  };

  const handleStopTracking = async () => {
    const finalRoute = stopTracking();
    setIsTracking(false);

    if (finalRoute.length < 2) {
      Alert.alert('No Data', 'Not enough location points recorded');
      return;
    }

    // Calculate activity metrics
    const duration =
      (finalRoute[finalRoute.length - 1].timestamp - finalRoute[0].timestamp) /
      1000;
    const distance = calculateDistance(finalRoute);
    const avgSpeed = distance / duration;

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
    await loadActivities();
  };

  const saveActivity = async (activity: Activity) => {
    try {
      const existing = await AsyncStorage.getItem('@activities');
      const activities = existing ? JSON.parse(existing) : [];
      activities.push(activity);
      await AsyncStorage.setItem('@activities', JSON.stringify(activities));
      Alert.alert('Saved', 'Activity saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save activity');
      console.error(error);
    }
  };

  // Haversine distance calculation
  const calculateDistance = (route: LocationPoint[]): number => {
    let total = 0;
    for (let i = 1; i < route.length; i++) {
      const prev = route[i - 1];
      const curr = route[i];
      total += haversineDistance(prev, curr);
    }
    return total;
  };

  const haversineDistance = (a: LocationPoint, b: LocationPoint): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (a.latitude * Math.PI) / 180;
    const φ2 = (b.latitude * Math.PI) / 180;
    const Δφ = ((b.latitude - a.latitude) * Math.PI) / 180;
    const Δλ = ((b.longitude - a.longitude) * Math.PI) / 180;

    const x =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

    return R * y;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RunPlus Tracker</Text>

      <View style={styles.controls}>
        {!isTracking ? (
          <Button
            title="Start Tracking"
            onPress={handleStartTracking}
            color="#2ecc71"
          />
        ) : (
          <Button
            title="Stop & Save"
            onPress={handleStopTracking}
            color="#e74c3c"
          />
        )}
      </View>

      <View style={styles.currentData}>
        <Text style={styles.sectionTitle}>Current Status:</Text>
        {currentLocation && (
          <>
            <Text>Lat: {currentLocation.latitude.toFixed(6)}</Text>
            <Text>Lng: {currentLocation.longitude.toFixed(6)}</Text>
            <Text>
              Speed:{' '}
              {(currentLocation.speed
                ? currentLocation.speed * 3.6
                : 0
              ).toFixed(1)}{' '}
              km/h
            </Text>
          </>
        )}
        <Text>Points: {locationData.length}</Text>
      </View>

      <ScrollView style={styles.dataContainer}>
        <Text style={styles.sectionTitle}>Activity History:</Text>
        {savedActivities.map(activity => (
          <View key={activity.id} style={styles.activityItem}>
            <Text>Date: {new Date(activity.timestamp).toLocaleString()}</Text>
            <Text>Distance: {(activity.distance / 1000).toFixed(3)} km</Text>
            <Text>Duration: {formatDuration(activity.duration)}</Text>
            <Text>Avg Speed: {(activity.avgSpeed * 3.6).toFixed(1)} km/h</Text>
            <Text>Points: {activity.route.length}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Helper: Format seconds to HH:MM:SS
const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3498db',
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2c3e50',
  },
  activityItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
  },
});

export default HomeScreen;
