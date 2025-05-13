import { create } from "zustand";
import useDashboardStore, { Dashboard } from "./useDashboardStore";
import useTaskStore, { Task } from "./useTaskStore";

// Types
export interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface TagStoreState {
  currentTags: Tag[];
  tagIdToEdit: string | null;

  getDashboardTags: (dashboardId: string) => Promise<void>;
  addNewDashboardTag: (dashboardId: string | null, tagData: Tag) => Promise<void>;
  deleteDashboardTag: (tagId: string) => Promise<void>;
  getTagById: (tagId: string) => Tag | undefined;
  setTagIdToEdit: (tagId: string) => void;
  updateTag: (tagId: string, updates: Partial<Tag>) => Promise<void>;
}

const useTagStore = create<TagStoreState>((set, get) => {
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
    await window.electronAPI?.saveDashboards(dashboards);
  };

  return {
    currentTags: [],
    tagIdToEdit: null,

    getDashboardTags: async (dashboardId: string) => {
      const dashboards = await loadDashboardsFromDisk();
      const dashboard = dashboards.find((d) => d.id === dashboardId);
      if (dashboard) {
        set({ currentTags: dashboard.tags || [] });
      }
    },

    addNewDashboardTag: async (dashboardId, tagData) => {
      const dashboards = await loadDashboardsFromDisk();
      const targetId =
        dashboardId || useDashboardStore.getState().currentDashboardId;
      if (!targetId) return;

      const updatedDashboards = dashboards.map((d) =>
        d.id === targetId
          ? { ...d, tags: [...(d.tags || []), tagData] }
          : d
      );

      await persistDashboards(updatedDashboards);

      const updatedDashboard = updatedDashboards.find((d) => d.id === targetId);
      set({ currentTags: updatedDashboard?.tags || [] });
    },

    deleteDashboardTag: async (tagId) => {
      const dashboards = await loadDashboardsFromDisk();
      const targetId = useDashboardStore.getState().currentDashboardId;
      if (!targetId) return;

      const updatedDashboards = dashboards.map((dashboard) =>
        dashboard.id === targetId
          ? {
              ...dashboard,
              tags: (dashboard.tags || []).filter((tag) => tag.id !== tagId),
            }
          : dashboard
      );

      await persistDashboards(updatedDashboards);

      const updatedDashboard = updatedDashboards.find((d) => d.id === targetId);
      set({ currentTags: updatedDashboard?.tags || [] });

      const taskStore = useTaskStore.getState();
      const cleanedColumns = Object.fromEntries(
        Object.entries(taskStore.columns).map(([columnId, tasks]) => [
          columnId,
          tasks.map((task: any) => ({
            ...task,
            tags: (task.tags || []).filter((tag: Tag) => tag.id !== tagId),
          })),
        ])
      ) as typeof taskStore.columns;

      useTaskStore.setState({ columns: cleanedColumns });
      await taskStore.saveTasks(cleanedColumns);
    },

    getTagById: (tagId: string) => {
      return get().currentTags.find((t) => t.id === tagId);
    },

    setTagIdToEdit: (tagId: string) => {
      set({ tagIdToEdit: tagId });
    },

    updateTag: async (tagId, updates) => {
      const dashboards = await loadDashboardsFromDisk();
      const targetId = useDashboardStore.getState().currentDashboardId;
      if (!targetId) return;

      const updatedDashboards = dashboards.map((dashboard) => {
        if (dashboard.id !== targetId) return dashboard;

        const updatedTags = (dashboard.tags || []).map((tag) =>
          tag.id === tagId ? { ...tag, ...updates } : tag
        );

        return { ...dashboard, tags: updatedTags };
      });

      await persistDashboards(updatedDashboards);

      const updatedDashboard = updatedDashboards.find((d) => d.id === targetId);
      set({ currentTags: updatedDashboard?.tags || [] });

      const taskStore = useTaskStore.getState();
      const cleanedColumns = Object.fromEntries(
        Object.entries(taskStore.columns).map(([columnId, tasks]) => [
          columnId,
          tasks.map((task: any) => ({
            ...task,
            tags: (task.tags || []).map((tag: Tag) =>
              tag.id === tagId ? { ...tag, ...updates } : tag
            ),
          })),
        ])
      ) as typeof taskStore.columns;

      useTaskStore.setState({ columns: cleanedColumns });
      await taskStore.saveTasks(cleanedColumns);
    },
  };
});

export default useTagStore;
