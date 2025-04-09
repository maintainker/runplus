// src/lib/supabase.ts
import {createClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
// AsyncStorage 기반의 커스텀 저장소 어댑터
const asyncStorageAdapter = {
  getItem: async (key: string) => {
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
};

// Supabase 구성 (실제 값으로 대체 필요)
const SUPABASE_URL = 'https://bjtylwnqomxmrjvijmnz.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqdHlsd25xb214bXJqdmlqbW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTQ2ODMsImV4cCI6MjA1OTU3MDY4M30.KwIL5N7C-Z4QOKDGzTKmerdAs4vK8npVMegiVInJByA';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(`
    Supabase 환경 변수가 설정되지 않았습니다!
    프로젝트 루트에 .env 파일을 생성하고 다음을 추가하세요:
    SUPABASE_URL=YOUR_PROJECT_URL
    SUPABASE_ANON_KEY=YOUR_ANON_KEY
  `);
}

// Supabase 클라이언트 생성
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: asyncStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // React Native에서는 false로 설정
  },
});
