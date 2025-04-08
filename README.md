# 🏃 RunPlus - 러닝 트래킹 앱

<div align="center">
  <img src="./assets/app-icon.png" width="150">
  <p>러닝/걷기 경로를 기록하고 건강 통계를 제공하는 모바일 앱</p>
</div>

## 📌 핵심 기능

| 기능               | 설명                                | 구현 상태 |
| ------------------ | ----------------------------------- | --------- |
| 🛰️ 실시간 GPS 추적 | Google Maps 기반 운동 경로 기록     | ✅ 80%    |
| 📊 활동 통계       | 주간/월간 거리, 속도, 칼로리 시각화 | ⏳ 20%    |
| 🔐 계정 연동       | Supabase Auth로 다중 기기 동기화    | ✅ 100%   |
| 📱 오프라인 지원   | SQLite 로컬 저장 후 자동 동기화     | ❌ 0%     |

## 🛠 기술 스택

**Frontend**  
![React Native](https://img.shields.io/badge/React_Native-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

**Backend**  
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)

## 📅 개발 일정

### Day 1: 인프라 구축

```bash
# 주요 작업
- Expo 프로젝트 초기화 (TypeScript 템플릿)
- Supabase 연동: Auth + DB 테이블 생성
- 기본 네비게이션 구조 구현 (Bottom Tabs)
Day 2: 코어 기능 개발
javascript
Copy
// 현재 진행 사항
1. 위치 권한 처리 (Android/iOS 별 설정 완료)
2. react-native-maps와 Geolocation 연동
3. 운동 시작/정지 로직 구현 중
남은 개발 계획
일차	주요 작업	비고
3	통계 차트 구현 (Victory Native)	디자인 검토 필요
4	오프라인 동기화 로직	SQLite 연동
5	소셜 로그인 (Google/Apple)	OAuth 설정
🚀 실행 방법
의존성 설치

bash
Copy
npm install
npx pod-install
환경 변수 설정 (.env)

ini
Copy
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-anon-key
개발 서버 실행

bash
Copy
npm run android  # 또는 ios
📂 프로젝트 구조
Copy
/src
├── components/
│   ├── MapViewer.tsx   # 지도 컴포넌트
│   └── RunButton.tsx   # 운동 제어 버튼
├── lib/
│   └── supabase.ts     # Supabase 클라이언트
├── navigation/
│   └── MainTabNavigator.tsx
└── screens/
    ├── HomeScreen.tsx
    └── ProfileScreen.tsx
⚠️ 현재 이슈
markdown
Copy
1. **Android 백그라운드 위치 추적**
   - Foreground Service 구현 필요
```
