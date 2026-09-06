export type UserRole = "MEMBER" | "ADMIN";
export type LogSource = "AI" | "MANUAL";
export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "DRINK" | "OTHER";

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string | number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
