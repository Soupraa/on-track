import { create } from "zustand";
import { Tag } from "./useTagStore";
import { Task } from "./useTaskStore";

export interface Dashboard {
    id: string;
    title: string;
    tags: Tag[];
    todo: Task[];
    progress: Task[];
    done: Task[];
    createdAt?: string;
    updatedAt?: string;
}

interface DashboardState {
    currentDashboardId: string | null;
    dashboards: Dashboard[];
    dashboardToEditId: string | null;

    initializeDashboards: () => Promise<boolean>;
    setActiveDashboard: (dashboardId: string | null) => void;
    saveDashboards: () => Promise<void>;
    editExistingDashboard: (dashboardId: string, newTitle: string) => Promise<void>;
    setDashboardToEdit: (dashboardId: string | null) => void;
    addNewDashboard: (dashboardName: string) => Promise<void>;
    deleteDashboard: (dashboardId: string) => Promise<void>;
}

const useDashboardStore = create<DashboardState>((set, get) => {
    // Helpers
    const loadDashboardsFromDisk = async (): Promise<Dashboard[]> => {
        try {
            const data = await window.electronAPI?.loadTasks();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Failed to load dashboards:", error);
            return [];
        }
    };

    const persistDashboards = async (dashboards: Dashboard[]) => {
        console.log("SAVING DASHBOARD")
        await window.electronAPI?.saveDashboards(dashboards);
    };

    return {
        currentDashboardId: null,
        dashboards: [],
        dashboardToEditId: null,

        initializeDashboards: async () => {
            const data = await loadDashboardsFromDisk();
            if (data.length === 0) return false;

            set({
                currentDashboardId: data[0].id,
                dashboards: data.map((d) => ({
                    id: d.id,
                    title: d.title,
                    tags: d.tags,
                    todo: d.todo,
                    progress: d.progress,
                    done: d.done,
                    updatedAt: d.updatedAt,
                    createdAt: d.createdAt,
                })),
            });
            console.log(get().dashboards);
            await persistDashboards(get().dashboards);
            return true;
        },

        setActiveDashboard: (dashboardId: string | null) => {
            set({ currentDashboardId: dashboardId });
        },

        saveDashboards: async () => {
            await persistDashboards(get().dashboards);
        },

        editExistingDashboard: async (dashboardId: string, newTitle: string) => {
            const dashboards = await loadDashboardsFromDisk();

            const updated = dashboards.map((d) =>
                d.id === dashboardId ? { ...d, title: newTitle } : d
            );

            set({ dashboards: updated });
            await persistDashboards(updated);
        },

        setDashboardToEdit: (dashboardId: string | null) => {
            set({ dashboardToEditId: dashboardId });
        },

        addNewDashboard: async (dashboardName: string) => {
            const dashboards = await loadDashboardsFromDisk();

            const newDashboard: Dashboard = {
                id: Date.now().toString(),
                title: dashboardName,
                tags: [],
                todo: [],
                progress: [],
                done: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const updated = [...dashboards, newDashboard];
            set({ dashboards: updated });
            get().setActiveDashboard(newDashboard.id);
            await persistDashboards(updated);
        },

        deleteDashboard: async (dashboardId: string) => {
            const dashboards = await loadDashboardsFromDisk();

            const filtered = dashboards.filter((d) => d.id !== dashboardId);
            const newActive = filtered.length > 0 ? filtered[0].id : null;

            get().setActiveDashboard(newActive);
            set({ dashboards: filtered });
            await persistDashboards(filtered);
        },
    };
});

export default useDashboardStore;
