import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { Dashboard, DashboardColumnData, SavedData } from "./fileSystem";

type DashboardData = {
    id: string;
    title: string;
    tags: string[];
    createdAt?: string;
    updatedAt?: string;
};

type ContextMenuCallback = (payload: { action: string; id: string }) => void;

contextBridge.exposeInMainWorld("electronAPI", {
    // Task methods
    loadTasks: (): Promise<Dashboard[]> => ipcRenderer.invoke("load-tasks"),

    saveTasks: async (
        dashboardData: DashboardData,
        columnData: DashboardColumnData
    ): Promise<void> => {
        const cleanData = {
            todo: JSON.parse(JSON.stringify(columnData.todo || [])),
            progress: JSON.parse(JSON.stringify(columnData.progress || [])),
            done: JSON.parse(JSON.stringify(columnData.done || [])),
        };
        ipcRenderer.send("save-tasks", dashboardData, cleanData);
    },
    getAppState: (): Promise<SavedData> => ipcRenderer.invoke("get-app-state"),
    saveSettings: async (settings: any): Promise<void> => {
        ipcRenderer.send("save-settings", settings);
    },
    saveDashboards: async (appData: any, dashboards: Dashboard[]): Promise<void> => {
        ipcRenderer.send("save-dashboards", appData, dashboards);
    },

    showContextMenu: (dashboardId: string): void => {
        ipcRenderer.send("show-dashboard-context-menu", dashboardId);
    },

    onContextMenuCommand: (callback: ContextMenuCallback): void => {
        ipcRenderer.on("context-menu-command", (_event: IpcRendererEvent, payload) =>
            callback(payload)
        );
    },

    getAppVersion: (): Promise<string> => ipcRenderer.invoke("get-app-version"),
});
