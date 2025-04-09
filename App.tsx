import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView, StyleSheet} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import {AuthProvider} from './src/context/AuthContext';
import {PaperProvider} from 'react-native-paper';
const App = () => {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <SafeAreaView style={styles.container}>
            <AppNavigator />
          </SafeAreaView>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
