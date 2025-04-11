import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {supabase} from '../lib/supabase';

const ACTIVITY_KEY = '@activities';

export const saveActivity = async (activity: Activity) => {
  const id = Date.now().toString();
  const newActivity: Activity = {...activity, id, synced: false};

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

// Supabase에 동기화
export const syncWithSupabase = async () => {
  const {data: userData} = await supabase.auth.getUser();

  if (!userData.user) {
    console.error('User not found');
    throw new Error('User not found');
  }

  const existing = await AsyncStorage.getItem(ACTIVITY_KEY);
  const activities: Activity[] = existing ? JSON.parse(existing) : [];

  const unsyncedActivities = activities.filter(activity => !activity.synced);

  for (const activity of unsyncedActivities) {
    const {error} = await supabase.from('activities').insert({
      id: activity.id,
      route: activity.route,
      distance: activity.distance,
      duration: activity.duration,
      avg_speed: activity.avgSpeed,
      timestamp: activity.timestamp,
      date: activity.date,
      user_id: userData.user.id,
    });

    if (!error) {
      const updatedActivities = activities.map(a =>
        a.id === activity.id ? {...a, synced: true} : a,
      );
      await AsyncStorage.setItem(
        ACTIVITY_KEY,
        JSON.stringify(updatedActivities),
      );
    } else {
      console.error('Sync failed:', error);
      throw error;
    }
  }
};

export const setupNetworkSync = () => {
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      syncWithSupabase().catch(err => console.error('Sync error:', err));
    }
  });
  return unsubscribe;
};
