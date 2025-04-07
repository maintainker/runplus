// import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase(
//   {name: 'RunPlusDB', location: 'default'},
//   () => console.log('DB 연결 성공'),
//   error => console.error('DB 연결 실패:', error),
// );

// // 활동 테이블 생성
// export const initDB = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS activities (
//         id TEXT PRIMARY KEY,
//         route TEXT NOT NULL,
//         distance REAL NOT NULL,
//         duration INTEGER NOT NULL,
//         avgSpeed REAL NOT NULL,
//         date TEXT NOT NULL,
//         isSynced BOOLEAN DEFAULT 0
//       )`,
//     );
//   });
// };

// export default db;
