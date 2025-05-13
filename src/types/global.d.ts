import type { Dashboard } from "../store/useDashboardStore"; // Adjust the path as needed

export {};

declare global {
  interface Window {
    electronAPI: {
      loadTasks: () => Promise<Dashboard[]>;
      saveTasks: (dashboardData: any, columnData: any) => Promise<void>;
      saveDashboards: (dashboards: Dashboard[]) => Promise<void>;
      showContextMenu: (dashboardId: string) => void;
      onContextMenuCommand: (callback: (payload: any) => void) => void;
      getAppVersion: () => Promise<string>;
    };
  }
}