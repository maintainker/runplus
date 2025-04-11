import {WebView} from 'react-native-webview';
import {supabase} from '../../lib/supabase';
import {useEffect, useState} from 'react';
import {WEB_URL} from '@env';
import {SafeAreaView, StyleSheet} from 'react-native';
const ProfileScreen: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const {data} = await supabase.auth.getSession();
      if (data.session) {
        setToken(data.session.access_token);
      } else {
        console.error('No active session found');
      }
    };
    getToken();
  }, []);

  if (!token) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebView source={{uri: `${WEB_URL}/profile?token=${token}`}} />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
