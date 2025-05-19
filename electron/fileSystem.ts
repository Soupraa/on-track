import { app } from "electron";
import * as fs from "fs";
import * as path from "path";

export interface Task {
    id: string;
    title: string;
    text?: string;
}

export interface DashboardColumnData {
    todo: Task[];
    progress: Task[];
    done: Task[];
}

export interface Dashboard {
    id: string;
    title: string;
    tags: string[];
    columns: DashboardColumnData;
    createdAt?: string;
    updatedAt?: string;
}

export interface SavedData {
    isLightMode: boolean;
    dashboards: Dashboard[];
}

const DEFAULT_DASHBOARDS: Dashboard[] = [];
const DEFAULT_APPSTATE: SavedData = { isLightMode: false, dashboards: [] };

const getSavePath = (): string => {
    let savePath: string;
    let savesDir: string;
    if (app.isPackaged) {
        const userDataDir = app.getPath('userData');
        savesDir = path.join(userDataDir, 'saves');
        savePath = path.join(savesDir, 'app-data.json');
    }
    else {
        savesDir = path.join(__dirname, "saves");
        savePath = path.join(savesDir, "app-data.json");
    }
    if (!fs.existsSync(savesDir)) {
        fs.mkdirSync(savesDir, { recursive: true });
    }

    if (!fs.existsSync(savePath)) {
        const initialData: SavedData = {
            isLightMode: false,
            dashboards: DEFAULT_DASHBOARDS
        };
        fs.writeFileSync(savePath, JSON.stringify(initialData, null, 2));
    }
    return savePath;
};

const saveTasks = (
    dashboardData: Omit<Dashboard, "columns" | "updatedAt" | "createdAt">,
    columnData: DashboardColumnData
): boolean => {
    try {
        const savePath = getSavePath();
        const fileData = fs.readFileSync(savePath, "utf8");
        const parsed: SavedData = JSON.parse(fileData);
        const allDashboards = parsed.dashboards;

        const dashboardIndex = allDashboards.findIndex((d) => d.id === dashboardData.id);
        const now = new Date().toISOString();

        const updatedDashboard: Dashboard = {
            ...dashboardData,
            columns: columnData,
            updatedAt: now,
            createdAt: dashboardIndex >= 0 ? allDashboards[dashboardIndex].createdAt : now
        };

        if (dashboardIndex >= 0) {
            allDashboards[dashboardIndex] = updatedDashboard;
        } else {
            allDashboards.push(updatedDashboard);
        }

        const dataToSave: SavedData = {
            isLightMode: parsed.isLightMode,
            dashboards: allDashboards
        };

        fs.writeFileSync(savePath, JSON.stringify(dataToSave, null, 2));
        console.log(`Dashboard ${dashboardData.id} saved successfully`);
        return true;
    } catch (error) {
        console.error("Save failed:", error);
        return false;
    }
};

const loadTasks = (): Dashboard[] => {
    try {
        const savePath = getSavePath();
        const data = fs.readFileSync(savePath, "utf8");
        const parsed: SavedData = JSON.parse(data);

        if (Array.isArray(parsed.dashboards)) {
            return parsed.dashboards;
        }

        console.warn("Invalid data structure, returning defaults");
        return DEFAULT_DASHBOARDS;
    } catch (error) {
        console.error("Error loading tasks:", error);
        return DEFAULT_DASHBOARDS;
    }
};

const saveDashboards = (appData: any, dashboards: Dashboard[]): void => {
    try {
        const savePath = getSavePath();
        const dataToSave: SavedData = {
            isLightMode: appData?.isLightMode || false,
            dashboards: dashboards
        };

        fs.writeFileSync(savePath, JSON.stringify(dataToSave, null, 2));
        console.log("File written successfully!");
    } catch (error) {
        console.error("Error writing to file:", error);
    }
};
const getAppState = (): SavedData => {
    try {
        const savePath = getSavePath();
        const data = fs.readFileSync(savePath, "utf8");
        const parsed: SavedData = JSON.parse(data);

        if (parsed) {
            return parsed;
        }

        console.warn("Invalid data structure, returning defaults");
        return DEFAULT_APPSTATE;
    } catch (error) {
        console.error("Error loading tasks:", error);
        return DEFAULT_APPSTATE;
    }
}
const saveSettings = (settings: SavedData): void => {
    try {
        const savePath = getSavePath();
        const fileData = fs.readFileSync(savePath, "utf8");
        const parsed: SavedData = JSON.parse(fileData);

        const dataToSave: SavedData = {
            ...parsed,
            isLightMode: settings.isLightMode // only update isLightMode
        };

        fs.writeFileSync(savePath, JSON.stringify(dataToSave, null, 2));
        console.log("Settings saved successfully.");
    } catch (error) {
        console.error("Error saving settings:", error);
    }
};

export { saveTasks, loadTasks, saveDashboards, getAppState, saveSettings };
