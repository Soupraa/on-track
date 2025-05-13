import { create } from "zustand";
import useTagStore from "./useTagStore";
import { Dashboard } from "./useDashboardStore";

export interface Task {
  id: string;
  title: string;
  text?: string;
  strike?: boolean;
  isOpen?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardColumnData {
  todo: Task[];
  progress: Task[];
  done: Task[];
}

interface TaskStoreState {
  columns: DashboardColumnData;
  storeDashboardId: string | null;
  storeDashboardTitle: string | null;

  addTask: (columnId: keyof DashboardColumnData, updates: Partial<Task>) => void;
  updateTask: (itemId: string, updates: Partial<Task>) => void;
  moveTask: (itemId: string, targetColumn: keyof DashboardColumnData) => void;
  deleteTask: (itemId: string) => void;
  saveTasks: (newColumns?: DashboardColumnData) => Promise<void>;
  loadTasksByDashboardId: (id: string) => Promise<void>;
}

const useTaskStore = create<TaskStoreState>((set, get) => ({
  columns: {
    todo: [],
    progress: [],
    done: [],
  },
  storeDashboardId: null,
  storeDashboardTitle: null,

  addTask: (columnId, updates) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: updates.title || "Untitled Task",
      text: updates.text || "",
      strike: false,
      isOpen: true,
      tags: updates.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      columns: {
        ...state.columns,
        [columnId]: [...state.columns[columnId], newTask],
      },
    }));

    get().saveTasks();
  },

  updateTask: (itemId, updates) => {
    set((state) => {
      const newColumns: DashboardColumnData = { ...state.columns };
      let wasUpdated = false;

      (Object.keys(newColumns) as (keyof DashboardColumnData)[]).forEach((columnId) => {
        newColumns[columnId] = newColumns[columnId].map((item) => {
          if (item.id === itemId) {
            wasUpdated = true;
            return {
              ...item,
              ...updates,
              strike: updates.strike ?? item.strike,
              isOpen: updates.isOpen ?? item.isOpen,
              tags: updates.tags ?? item.tags,
              updatedAt: new Date().toISOString(),
            };
          }
          return item;
        });
      });

      if (wasUpdated) {
        get().saveTasks(newColumns);
        return { columns: newColumns };
      }

      return state;
    });
  },

  moveTask: (itemId, targetColumn) => {
    set((state) => {
      const newColumns: DashboardColumnData = { ...state.columns };

      // Remove from all columns
      (Object.keys(newColumns) as (keyof DashboardColumnData)[]).forEach((columnId) => {
        newColumns[columnId] = newColumns[columnId].filter((item) => item.id !== itemId);
      });

      const allItems = Object.values(state.columns).flat();
      const movedItem = allItems.find((item) => item.id === itemId);

      if (movedItem) {
        newColumns[targetColumn] = [...newColumns[targetColumn], movedItem];
      }

      get().saveTasks(newColumns);
      return { columns: newColumns };
    });
  },

  deleteTask: (itemId) => {
    set((state) => {
      const newColumns: DashboardColumnData = { ...state.columns };
      let wasDeleted = false;

      (Object.keys(newColumns) as (keyof DashboardColumnData)[]).forEach((columnId) => {
        const originalLength = newColumns[columnId].length;
        newColumns[columnId] = newColumns[columnId].filter((item) => item.id !== itemId);
        if (newColumns[columnId].length !== originalLength) {
          wasDeleted = true;
        }
      });

      if (wasDeleted) {
        get().saveTasks(newColumns);
        return { columns: newColumns };
      }

      return state;
    });
  },

  saveTasks: async (newColumns) => {
    try {
      const state = get();
      const currentTags = useTagStore.getState().currentTags;

      const currentDashboard = {
        id: state.storeDashboardId!,
        title: state.storeDashboardTitle!,
        tags: currentTags,
      };

      await window.electronAPI.saveTasks(
        currentDashboard,
        newColumns ?? state.columns
      );
    } catch (error) {
      console.error("Save failed:", error);
    }
  },

  loadTasksByDashboardId: async (id) => {
    const dashboards = await window.electronAPI?.loadTasks();
    const dashboard: any = dashboards?.find((d: any) => d.id === id);

    if (dashboard) {
      set({
        storeDashboardId: id,
        storeDashboardTitle: dashboard.title,
        columns: {
          todo: dashboard.todo || [],
          progress: dashboard.progress || [],
          done: dashboard.done || [],
        },
      });
    }
  },
}));

export default useTaskStore;
