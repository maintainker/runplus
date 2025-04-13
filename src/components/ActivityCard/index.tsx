import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import RunPlusSvg from '../../asset/svg';

const {width: screenWidth} = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.85;

const ActivityCard = ({activity}: {activity: Activity}) => {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.username}>User Name</Text>
        <Text style={styles.date}>{activity.date}</Text>
        <Text style={styles.data}>
          {activity.distance.toFixed(1)}km •{' '}
          {(activity.duration / 60).toFixed(1)}분
        </Text>
        <Text style={styles.data}>
          평균 속도: {activity.avgSpeed.toFixed(1)}km/h
        </Text>
      </View>
      <Image
        source={{uri: 'https://via.placeholder.com/300x150'}}
        style={styles.snapshot}
      />
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <RunPlusSvg name="Heart" size={20} color="#3B82F6" />
          <Text style={styles.actionText}>좋아요</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <RunPlusSvg name="Comment" size={20} color="#3B82F6" />
          <Text style={styles.actionText}>댓글</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    padding: 15,
    marginHorizontal: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 10,
  },
  info: {marginBottom: 10},
  username: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  date: {fontSize: 14, color: '#666', marginVertical: 5},
  data: {fontSize: 14, color: '#333'},
  snapshot: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    color: '#3B82F6',
    fontSize: 14,
  },
});

export default ActivityCard;
