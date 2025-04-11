declare type LocationPoint = {
  latitude: number;
  longitude: number;
  speed: number | null;
  timestamp: number;
};

declare type Activity = {
  id: string;
  route: LocationPoint[];
  distance: number;
  duration: number;
  avgSpeed: number;
  timestamp: number;
  date: string;
  synced?: boolean;
};
