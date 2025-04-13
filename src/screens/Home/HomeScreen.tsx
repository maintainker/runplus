import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ActivityCard from '../../components/ActivityCard';
import RunPlusSvg from '../../asset/svg';
import {useAuth} from '../../context/AuthContext';
import {
  fetchFeedActivities,
  fetchWeeklySummary,
} from '../../service/FeedService';
const {width: screenWidth} = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.85;
const CARD_MARGIN = 10;

// 더미 데이터
const dummyActivities: Activity[] = [
  {
    id: '1',
    route: [
      {latitude: 37.5, longitude: -122.4, speed: 10, timestamp: 1234567890},
    ],
    distance: 5.2,
    duration: 1695, // 28:15
    avgSpeed: 11.0,
    timestamp: 1234567890,
    date: '2025-04-10',
    synced: true,
  },
  {
    id: '2',
    route: [
      {latitude: 37.6, longitude: -122.5, speed: 12, timestamp: 1234567900},
    ],
    distance: 8.0,
    duration: 2400, // 40:00
    avgSpeed: 12.0,
    timestamp: 1234567900,
    date: '2025-04-09',
    synced: true,
  },
  {
    id: '3',
    route: [
      {latitude: 37.7, longitude: -122.6, speed: 10, timestamp: 1234567910},
    ],
    distance: 3.5,
    duration: 1200, // 20:00
    avgSpeed: 10.5,
    timestamp: 1234567910,
    date: '2025-04-08',
    synced: true,
  },
];

// 더미 요약 데이터
const summary = {
  weeklyDistance: 16.7,
  weeklyActivities: 3,
};

interface Summary {
  weeklyDistance: number;
  weeklyActivities: number;
}

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [summary, setSummary] = useState<Summary>({
    weeklyDistance: 0,
    weeklyActivities: 0,
  });

  const flatListRef = useRef<FlatList>(null);
  const {logout, user} = useAuth();
  const handleLogout = () => {
    logout();
  };
  const loadActivities = async (pageNum: number) => {
    if (isLoading || !hasMore || !user?.id) return;
    setIsLoading(true);
    const newActivities = await fetchFeedActivities(user?.id, pageNum);
    if (newActivities.length < 10) setHasMore(false);
    calculateSummary(newActivities);
    setActivities(prev =>
      pageNum === 1 ? newActivities : [...prev, ...newActivities],
    );
    // setSummary();
    setIsLoading(false);
  };
  const calculateSummary = (activities: Activity[]): Summary => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyActivities = activities.filter(
      activity => new Date(activity.date) >= oneWeekAgo,
    );
    const weeklyDistance = weeklyActivities.reduce(
      (sum, activity) => sum + activity.distance,
      0,
    );
    return {
      weeklyDistance: Number(weeklyDistance.toFixed(1)),
      weeklyActivities: weeklyActivities.length,
    };
  };
  // 스크롤 시 activeIndex 업데이트
  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (CARD_WIDTH + CARD_MARGIN));
    setActiveIndex(index);
  };

  // FlatList 렌더링 최적화
  const getItemLayout = (data: any, index: number) => ({
    length: CARD_WIDTH + CARD_MARGIN,
    offset: (CARD_WIDTH + CARD_MARGIN) * index,
    index,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        loadActivities(1);
        const summary = await fetchWeeklySummary(user.id);
        if (!('code' in summary) && 'weeklyDistance' in summary) {
          setSummary(summary);
        } else {
          console.error('Summary fetch error:', summary);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>RunPlus</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <RunPlusSvg
                name="Search"
                size={24}
                color="#000"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <RunPlusSvg
                name="Person"
                size={24}
                color="#000"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 요약 섹션 */}
        <View style={styles.summary}>
          <Text style={styles.sectionTitle}>이번 주 요약</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              거리: {summary.weeklyDistance.toFixed(1)} km
            </Text>
            <Text style={styles.summaryText}>
              활동: {summary.weeklyActivities}회
            </Text>
          </View>
        </View>

        {/* 빠른 액션 버튼 */}
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.buttonText}>러닝 시작하기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.startButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>임시 로그아웃</Text>
        </TouchableOpacity>
        {/* 피드 섹션 */}
        <View style={styles.feed}>
          <Text style={styles.sectionTitle}>최근 기록</Text>
          <FlatList
            ref={flatListRef}
            data={dummyActivities}
            keyExtractor={item => item.id}
            renderItem={({item}) => <ActivityCard activity={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_MARGIN}
            decelerationRate="fast"
            contentContainerStyle={styles.carousel}
            onScroll={onScroll}
            scrollEventThrottle={16}
            getItemLayout={getItemLayout}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
          />
          {/* 페이지네이션 점 */}
          <View style={styles.pagination}>
            {dummyActivities.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {backgroundColor: activeIndex === index ? '#3B82F6' : '#ccc'},
                ]}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {fontSize: 24, fontWeight: 'bold', color: '#3B82F6'},
  headerIcons: {flexDirection: 'row'},
  icon: {marginLeft: 10},
  summary: {paddingHorizontal: 20, paddingTop: 10},
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  summaryText: {fontSize: 14, color: '#333'},
  startButton: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  buttonText: {color: 'white', fontWeight: 'bold', fontSize: 16},
  feed: {paddingHorizontal: 20, paddingBottom: 20, marginBottom: 4},
  sectionTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginVertical: 10,
  },
  carousel: {
    paddingHorizontal: CARD_MARGIN / 2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
