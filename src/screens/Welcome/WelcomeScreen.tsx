import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import RunPlusSvg from '../../asset/svg';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../@types/navigation';

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleEmailLogin = () => {
    console.log('email login');
    navigation.navigate('Login');
  };

  const handleAppleLogin = () => {
    Alert.alert('미구현된 기능', 'Apple 로그인은 현재 미구현된 기능입니다.');
  };

  const handleGoogleLogin = () => {
    Alert.alert('미구현된 기능', 'Google 로그인은 현재 미구현된 기능입니다.');
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>나만의</Text>
          <Text style={styles.headerText}>
            <Text style={styles.headerBlueText}>운동 스토리</Text>를
          </Text>
          <Text style={styles.headerText}>완성하는 시간</Text>
        </View>

        <Text style={styles.descriptionText}>
          RunPlus에 오신 것을 환영합니다.
        </Text>
        <Text style={styles.descriptionText}>
          당신의 운동 스토리를 완성하세요.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.emailButton} onPress={handleEmailLogin}>
          <RunPlusSvg name="Email" color="#000" size={24} />
          <Text style={styles.buttonText}>Email로 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.appleButton} onPress={handleAppleLogin}>
          <RunPlusSvg name="Apple" color="#000" size={24} />
          <Text style={styles.appleButtonText}>Apple 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}>
          <RunPlusSvg name="Google" color="#000" size={24} />
          <Text style={styles.buttonText}>Google 로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerContainer: {
    marginBottom: 12,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 40,
  },
  headerBlueText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066FF',
    lineHeight: 40,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 8,
    marginBottom: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  appleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  dotContainer: {
    position: 'absolute',
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0066FF',
    marginHorizontal: 2,
  },
  inactiveDot: {
    backgroundColor: '#e0e0e0',
  },
});

export default WelcomeScreen;
