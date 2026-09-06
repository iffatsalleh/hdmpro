export type AnalyticsEvent =
  | "signup"
  | "login"
  | "onboarding_completed"
  | "food_logged"
  | "weight_logged"
  | "coach_message_sent"
  | "lesson_completed"
  | "subscription_started";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function trackEvent(name: AnalyticsEvent, params?: Record<string, any>) {
  if (typeof window !== "undefined" && window.gtag) {
    // Ensure sensitive health information is never sent
    const safeParams = { ...params };
    delete safeParams.weight;
    delete safeParams.calories;
    delete safeParams.notes;

    window.gtag("event", name, safeParams);
  }
}
