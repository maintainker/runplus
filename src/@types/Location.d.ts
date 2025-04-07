declare type LocationPoint = {
  latitude: number;
  longitude: number;
  speed: number | null; // m/s 단위
  timestamp: number;
};

declare type Activity = {
  id: string;
  route: LocationPoint[];
  distance: number; // 미터 단위
  duration: number; // 초 단위
  avgSpeed: number; // m/s
  timestamp: number; // Unix MS
  date: string; // ISO 형식 (예: "2024-07-15T10:30:00Z")
};
