import { app } from "electron";
import * as fs from "fs";
import * as path from "path";

interface Task {
    id: string;
    title: string;
    text?: string;
}

interface DashboardColumnData {
    todo: Task[];
    progress: Task[];
    done: Task[];
}

interface Dashboard {
    id: string;
    title: string;
    tags: string[];
    columns: DashboardColumnData;
    updatedAt?: string;
}

const DEFAULT_DATA: Dashboard[] = [];


const getSavePath = (): string => {
    const savesDir = path.join(__dirname, "saves");
    const savePath = path.join(savesDir, "app-data.json");

    // Create saves/ directory if it doesn't exist
    if (!fs.existsSync(savesDir)) {
        fs.mkdirSync(savesDir, { recursive: true });
    }

    // Create app-data.json if it doesn't exist
    if (!fs.existsSync(savePath)) {
        fs.writeFileSync(savePath, JSON.stringify(DEFAULT_DATA, null, 2));
    }

    return savePath;
    // return path.join(__dirname, "saves/app-data.json");
};
const saveTasks = (
    dashboardData: Omit<Dashboard, "todo" | "progress" | "done" | "updatedAt">,
    columnData: DashboardColumnData
): boolean => {
    try {
        const savePath = getSavePath();
        let allDashboards: Dashboard[] = [];

        const fileData = fs.readFileSync(savePath, "utf8");
        const parsed = JSON.parse(fileData);
        if (!Array.isArray(parsed)) throw new Error("Invalid data format");
        allDashboards = parsed;

        const dashboardIndex = allDashboards.findIndex(
            (d) => d.id === dashboardData.id
        );

        const updatedDashboard: Dashboard = {
            ...dashboardData,
            columns: {
                ...columnData,
            },
            updatedAt: new Date().toISOString(),
        };

        if (dashboardIndex >= 0) {
            allDashboards[dashboardIndex] = updatedDashboard;
        } else {
            allDashboards.push(updatedDashboard);
        }

        fs.writeFileSync(savePath, JSON.stringify(allDashboards, null, 2));
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
        const parsed = JSON.parse(data);

        if (
            Array.isArray(parsed) &&
            parsed.every(
                (item) =>
                    typeof item === "object" &&
                    item !== null &&
                    typeof item.id === "string" &&
                    typeof item.title === "string" &&
                    Array.isArray(item.columns.todo) &&
                    Array.isArray(item.columns.progress) &&
                    Array.isArray(item.columns.done)
            )
        ) {
            return parsed as Dashboard[];
        }

        console.warn("Invalid data structure, returning defaults");
        return DEFAULT_DATA;
    } catch (error) {
        console.error("Error loading tasks:", error);
        return DEFAULT_DATA;
    }
};

const saveDashboards = (dashboards: Dashboard[]): void => {
    const savePath = getSavePath();
    try {
        fs.writeFileSync(savePath, JSON.stringify(dashboards, null, 2));
        console.log("File written successfully!");
    } catch (error) {
        console.error("Error writing to file:", error);
    }
};

export { saveTasks, loadTasks, saveDashboards, Dashboard, Task };
