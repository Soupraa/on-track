import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

type ColumnData = {
    todo: any[];
    progress: any[];
    done: any[];
};

type DashboardData = {
    id: string;
    title: string;
    tags: string[];
};

type ContextMenuCallback = (payload: { action: string; id: string }) => void;

contextBridge.exposeInMainWorld("electronAPI", {
    // Task methods
    loadTasks: (): Promise<any> => ipcRenderer.invoke("load-tasks"),

    saveTasks: async (
        dashboardData: DashboardData,
        columnData: ColumnData
    ): Promise<void> => {
        const cleanData = {
            todo: JSON.parse(JSON.stringify(columnData.todo || [])),
            progress: JSON.parse(JSON.stringify(columnData.progress || [])),
            done: JSON.parse(JSON.stringify(columnData.done || [])),
        };
        ipcRenderer.send("save-tasks", dashboardData, cleanData);
    },

    saveDashboards: async (dashboards: any[]): Promise<void> => {
        ipcRenderer.send("save-dashboards", dashboards);
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
