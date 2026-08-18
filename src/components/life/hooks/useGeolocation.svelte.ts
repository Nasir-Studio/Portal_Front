interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function createGeolocation() {
  let state = $state<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  function start() {
    if (!navigator.geolocation) {
      state = { ...state, error: "Geolocation not supported", loading: false };
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        state = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          error: null,
          loading: false,
        };
      },
      (err) => {
        state = { ...state, error: err.message, loading: false };
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  return {
    get state() {
      return state;
    },
    start,
  };
}