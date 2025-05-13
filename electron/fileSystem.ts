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
    todo: Task[];
    progress: Task[];
    done: Task[];
    updatedAt?: string;
}

const DEFAULT_DATA: Dashboard[] = [
    {
        id: "defaultId",
        title: "dashboard",
        tags: [],
        todo: [
            {
                id: "welcome",
                title: "Welcome to OnTrack",
                text: "Start creating tasks and tags, happy tasking :)",
            },
        ],
        progress: [],
        done: [],
    },
];

const getSavePath = (): string => {
    const userDataPath = app.getPath("userData");

    if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, { recursive: true });
    }

    return path.join(__dirname, "saves/app-data.json");
};

const saveTasks = (
    dashboardData: Omit<Dashboard, "todo" | "progress" | "done" | "updatedAt">,
    columnData: DashboardColumnData
): boolean => {
    try {
        let allDashboards: Dashboard[] = [];

        const savePath = getSavePath();

        if (fs.existsSync(savePath)) {
            const fileData = fs.readFileSync(savePath, "utf8");
            const parsed = JSON.parse(fileData);
            if (!Array.isArray(parsed)) throw new Error("Invalid data format");
            allDashboards = parsed;
        }

        if (
            !columnData ||
            !Array.isArray(columnData.todo) ||
            !Array.isArray(columnData.progress) ||
            !Array.isArray(columnData.done)
        ) {
            throw new Error("Invalid column data structure");
        }

        const dashboardIndex = allDashboards.findIndex(
            (d) => d.id === dashboardData.id
        );

        const updatedDashboard: Dashboard = {
            ...dashboardData,
            ...columnData,
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

        if (!fs.existsSync(savePath)) {
            console.log("No tasks file found, returning defaults");
            return DEFAULT_DATA;
        }

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
                    Array.isArray(item.todo) &&
                    Array.isArray(item.progress) &&
                    Array.isArray(item.done)
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
    fs.writeFileSync(savePath, JSON.stringify(dashboards, null, 2));
};

export { saveTasks, loadTasks, saveDashboards, Dashboard, Task };
