import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVITY_KEY = '@activities';

// 저장 함수
export const saveActivity = async (
  activity: Omit<Activity, 'id'>,
): Promise<string> => {
  const id = Date.now().toString(); // 간단한 ID 생성
  const newActivity: Activity = {...activity, id};

  // 기존 데이터 불러오기 → 새 활동 추가 → 저장
  const existing = await AsyncStorage.getItem(ACTIVITY_KEY);
  const activities = existing ? JSON.parse(existing) : [];
  activities.push(newActivity);

  await AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
  return id;
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
