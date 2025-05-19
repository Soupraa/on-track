import type { Dashboard } from "../store/useDashboardStore"; // Adjust the path as needed

export { };

declare global {
  interface Window {
    electronAPI: {
      saveSettings: any;
      loadTasks: () => Promise<Dashboard[]>;
      saveTasks: (dashboardData: any, columnData: any) => Promise<void>;
      saveSettings: (settings: any) => Promise<void>;
      saveDashboards: (appData: any, dashboards: Dashboard[]) => Promise<void>;
      showContextMenu: (dashboardId: string) => void;
      onContextMenuCommand: (callback: (payload: any) => void) => void;
      getAppVersion: () => Promise<string>;
      getAppState: () => Promise<any>;
    };
  }
}