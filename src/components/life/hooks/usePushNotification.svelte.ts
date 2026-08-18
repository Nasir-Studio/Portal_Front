const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

interface SubscribeOptions {
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  minutesBefore?: number;
}

export function createPushNotification() {
  let isSubscribed = $state(false);
  let permission = $state<NotificationPermission>("default");

  async function subscribe(opts: SubscribeOptions): Promise<boolean> {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported");
      return false;
    }
    if (!VAPID_PUBLIC_KEY) {
      console.warn("VAPID public key not configured");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      permission = result;

      if (result !== "granted") {
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      });

      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          city: opts.city,
          address: opts.address || "",
          latitude: opts.latitude,
          longitude: opts.longitude,
          notifyMinutesBefore: opts.minutesBefore || 5,
        }),
      });

      isSubscribed = true;
      return true;
    } catch (error) {
      console.error("Push subscription failed:", error);
      return false;
    }
  }

  async function unsubscribe(): Promise<void> {
    if (!("serviceWorker" in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const endpoint = subscription.endpoint;
        await fetch(`/api/subscribe?endpoint=${encodeURIComponent(endpoint)}`, {
          method: "DELETE",
        });
        await subscription.unsubscribe();
        isSubscribed = false;
      }
    } catch (error) {
      console.error("Unsubscribe failed:", error);
    }
  }

  async function checkSubscription(): Promise<boolean> {
    if (!("serviceWorker" in navigator)) return false;
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      isSubscribed = !!subscription;
      return !!subscription;
    } catch {
      return false;
    }
  }

  return {
    subscribe,
    unsubscribe,
    checkSubscription,
    get isSubscribed() {
      return isSubscribed;
    },
    get permission() {
      return permission;
    },
  };
}