export interface TruckPosition {
  lineid: string;
  car: string;
  time: string;
  location: string;
  longitude: number;
  latitude: number;
  cityid: string;
  cityname: string;
}

export interface ScheduleEntry {
  address: string;
  startTime: number;
  endTime: number;
  lat: number;
  lon: number;
  garbageDay: number[];
  recycleDay: number[];
}

export interface CollectionPoint {
  lineId: string;
  lineName: string;
  rank: number;
  stopName: string;
  village: string;
  address: string;
  lat: number;
  lon: number;
  scheduledTime: number;
  time: string;
  garbageDay: number[];
  recycleDay: number[];
  foodscrapDay: number[];
  memo: string;
  status: "passed" | "current" | "upcoming" | "not_on_duty" | "finished";
  etaMinutes: number | null;
  etaTime: string | null;
  delay: number | null;
  truck: {
    line_id: string;
    car: string;
    time: string;
    location: string;
    latitude: number;
    longitude: number;
  } | null;
}

export interface CollectionLine {
  lineId: string;
  lineName: string;
  city: string;
  onDuty: boolean;
  finished: boolean;
  delay: number | null;
  truck: {
    line_id: string;
    car: string;
    time: string;
    location: string;
    latitude: number;
    longitude: number;
  } | null;
  prevDeparture: {
    dep_date: string;
    first_seen_at: string;
    first_location: string;
    car: string;
  } | null;
  stops: Omit<CollectionPoint, "truck">[];
}

export interface CityConfig {
  id: string;
  name: string;
  nameJa: string;
  nameKo: string;
  hasRealtime: boolean;
  apiType: "ntpc" | "taichung" | "taipei" | "static";
  apiEndpoint?: string;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
