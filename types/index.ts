// filepath: minijira-frontend/src/types/index.ts
export interface MenuItem {
  label: string;
  icon: string;
  command: () => void;
}

export interface AppState {
  theme: string;
  newsActive: boolean;
  role: string;
  user: {
    name: string;
  };
}