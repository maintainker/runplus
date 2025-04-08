// src/screens/HomeScreen.tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>RunPlus</Text>
        </View>

        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.buttonText}>러닝1 시작하기</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>최근 기록</Text>
        <View style={styles.recentItem}>
          <Text>2023-11-20</Text>
          <Text>5.2km • 28:15</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {padding: 20},
  title: {fontSize: 24, fontWeight: 'bold'},
  startButton: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  buttonText: {color: 'white', fontWeight: 'bold'},
  sectionTitle: {
    marginLeft: 20,
    marginTop: 10,
    fontWeight: '600',
    fontSize: 16,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
});
