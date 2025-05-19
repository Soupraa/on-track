import { create } from "zustand";
import { Tag } from "./useTagStore";
import { Task } from "./useTaskStore";
import useAppStore from "./useAppStore";

export interface Dashboard {
    id: string;
    title: string;
    tags: Tag[];
    columns: DashboardColumns;
    createdAt?: string;
    updatedAt?: string;
}
export interface DashboardColumns {
    todo: Task[];
    progress: Task[];
    done: Task[];
}
interface DashboardState {
    currentDashboardId: string;
    dashboards: Dashboard[];
    dashboardToEditId: string;

    initializeDashboards: () => Promise<boolean>;
    setActiveDashboard: (dashboardId: string) => void;
    editExistingDashboard: (dashboardId: string, newTitle: string) => Promise<void>;
    setDashboardToEdit: (dashboardId: string) => void;
    addNewDashboard: (dashboardName: string) => Promise<void>;
    deleteDashboard: (dashboardId: string) => Promise<void>;
    getDashboardById: (dashboardId: string) => Dashboard | undefined;

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
        await window.electronAPI?.saveDashboards({ isLightMode: useAppStore.getState().isLightMode }, dashboards);
    };

    return {
        currentDashboardId: "",
        dashboards: [],
        dashboardToEditId: "",

        initializeDashboards: async () => {
            const data = await loadDashboardsFromDisk();
            if (data.length === 0) return false;

            set({
                currentDashboardId: data[0].id,
                dashboards: data.map((d) => ({
                    id: d.id,
                    title: d.title,
                    tags: d.tags,
                    columns: d.columns,
                    updatedAt: d.updatedAt,
                    createdAt: d.createdAt,
                })),
            });
            await persistDashboards(get().dashboards);
            return true;
        },

        setActiveDashboard: (dashboardId: string) => {
            set({ currentDashboardId: dashboardId });
        },

        editExistingDashboard: async (dashboardId: string, newTitle: string) => {
            const dashboards = await loadDashboardsFromDisk();

            const updated = dashboards.map((d) =>
                d.id === dashboardId ? { ...d, title: newTitle } : d
            );

            set({ dashboards: updated });
            await persistDashboards(updated);
        },

        setDashboardToEdit: (dashboardId: string) => {
            set({ dashboardToEditId: dashboardId });
        },

        addNewDashboard: async (dashboardName: string) => {
            const dashboards = await loadDashboardsFromDisk();

            const newDashboard: Dashboard = {
                id: Date.now().toString(),
                title: dashboardName,
                tags: [],
                columns: {
                    todo: [],
                    progress: [],
                    done: []
                },
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

            const filtered: Dashboard[] = dashboards.filter((d) => d.id !== dashboardId);
            const newActive: any = filtered.length > 0 ? filtered[0].id : null;

            get().setActiveDashboard(newActive);
            set({ dashboards: filtered });
            await persistDashboards(filtered);
        },
        getDashboardById: (dashboardId: string) => {
            return get().dashboards.find((d) => d.id === dashboardId);
        },
        clearColumnById: async (columnId: string) => {
            const dashboards = await loadDashboardsFromDisk();

            const currentDashboard: any = dashboards.find((d: Dashboard) => d.id === get().currentDashboardId);

            console.log(currentDashboard);
            if (!currentDashboard) {
                console.warn("No current dashboard found.");
                return;
            }
            currentDashboard[columnId] = [];

            console.log(currentDashboard)
        }
    };
});

export default useDashboardStore;
