import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {supabase} from '../lib/supabase';
import {Alert} from 'react-native';

const ACTIVITY_KEY = '@activities';

export const saveActivity = async (activity: Activity) => {
  try {
    const newActivity: Activity = {...activity, synced: false};

    const existing = await AsyncStorage.getItem(ACTIVITY_KEY);
    const activities = existing ? JSON.parse(existing) : [];
    activities.push(newActivity);
    await AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));

    const recentActivities =
      (await AsyncStorage.getItem('recentActivities')) || '[]';
    const parsedActivities = JSON.parse(recentActivities);
    const updatedActivities = [activity, ...parsedActivities].slice(0, 5);
    await AsyncStorage.setItem(
      'recentActivities',
      JSON.stringify(updatedActivities),
    );

    const networkState = await NetInfo.fetch();
    if (networkState.isConnected) {
      await syncWithSupabase();
    }

    return newActivity;
  } catch (error) {
    Alert.alert('save 활동 저장 실패:', (error as Error).message);
    console.error('활동 저장 실패:', error);
    throw error;
  }
};

// 전체 활동 조회 (최신순)
export const getActivities = async (): Promise<Activity[]> => {
  const data = await AsyncStorage.getItem(ACTIVITY_KEY);
  return data
    ? JSON.parse(data).sort(
        (a: Activity, b: Activity) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
    : [];
};

export const syncWithSupabase = async () => {
  try {
    const {
      data: {session},
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new Error(sessionError?.message || 'No active session');
    }

    const userId = session.user?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }

    const existing = await AsyncStorage.getItem(ACTIVITY_KEY);
    const activities: Activity[] = existing ? JSON.parse(existing) : [];
    const unsyncedActivities = activities.filter(a => !a.synced);

    if (unsyncedActivities.length === 0) {
      return {success: true, message: 'No activities to sync'};
    }

    const {error} = await supabase.from('activities').insert(
      unsyncedActivities.map(activity => ({
        route: activity.route,
        distance: activity.distance,
        duration: activity.duration,
        avg_speed: activity.avgSpeed,
        timestamp: activity.timestamp,
        date: activity.date,
        user_id: userId,
        synced: true,
      })),
    );

    if (error) throw error;

    const updatedActivities = activities.map(a =>
      unsyncedActivities.some(u => u.id === a.id) ? {...a, synced: true} : a,
    );
    await AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(updatedActivities));

    return {success: true, count: unsyncedActivities.length};
  } catch (error) {
    console.error('동기화 실패:', error);
    throw error;
  }
};

export const setupNetworkSync = () => {
  NetInfo.fetch().then(state => {
    if (state.isConnected) {
      syncWithSupabase().catch(err => console.error('초기 동기화 실패:', err));
    }
  });
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      syncWithSupabase().catch(err => console.error('Sync error:', err));
      Alert.alert('네트워크 연결 성공');
    }
  });
  return unsubscribe;
};
