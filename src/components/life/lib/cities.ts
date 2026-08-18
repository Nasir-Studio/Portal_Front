import type { CityConfig } from "./types";

export const cities: CityConfig[] = [
  {
    id: "newtaipei",
    name: "新北市",
    nameJa: "新北市",
    nameKo: "신베이시",
    hasRealtime: true,
    apiType: "ntpc",
    apiEndpoint: "https://data.ntpc.gov.tw/api/datasets/28ab4122-60e1-4065-98e5-abccb69aaca6/json?page=0&size=1000",
  },
  {
    id: "taichung",
    name: "臺中市",
    nameJa: "台中市",
    nameKo: "타이중시",
    hasRealtime: true,
    apiType: "taichung",
    apiEndpoint: "https://newdatacenter.taichung.gov.tw/api/v1/no-auth/resource.download?rid=c923ad20-2ec6-43b9-b3ab-54527e99f7bc",
  },
];

export function getCityById(id: string): CityConfig | undefined {
  return cities.find((c) => c.id === id);
}

export interface ScheduleCity {
  id: string;
  name: string;
  official: boolean;
}

export const scheduleCities: ScheduleCity[] = [
  { id: "newtaipei", name: "新北市", official: true },
  { id: "taipei", name: "臺北市", official: false },
  { id: "taichung", name: "臺中市", official: true },
];
