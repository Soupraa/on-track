import { create } from "zustand";
import useTagStore, { Tag } from "./useTagStore";
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  text?: string;
  strike?: boolean;
  isOpen?: boolean;
  tags?: Tag[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardColumnData {
  todo: Task[];
  progress: Task[];
  done: Task[];
  [key: string]: any;
}

interface TaskStoreState {
  columns: DashboardColumnData;
  storeDashboardId: string | null;
  storeDashboardTitle: string | null;

  addTask: (columnId: keyof DashboardColumnData, updates: Partial<Task>) => void;
  updateTask: (itemId: string, updates: Partial<Task>) => void;
  deleteTask: (itemId: string) => void;
  saveTasks: (newColumns?: DashboardColumnData) => Promise<void>;
  loadTasksByDashboardId: (id: string) => Promise<void>;
  moveTaskToIndex: (
    itemId: string,
    fromColumnId: string,
    columnId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
}

const useTaskStore = create<TaskStoreState>((set, get) => ({
  columns: {
    todo: [],
    progress: [],
    done: [],
  },
  storeDashboardId: null,
  storeDashboardTitle: null,

  addTask: (columnId, updates: any) => {
    const newTask: Task = {
      id: uuidv4(),
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
        newColumns[columnId] = newColumns[columnId].map((item: Task) => {
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
  deleteTask: (itemId) => {
    set((state) => {
      const newColumns: DashboardColumnData = { ...state.columns };
      let wasDeleted = false;

      (Object.keys(newColumns) as (keyof DashboardColumnData)[]).forEach((columnId) => {
        const originalLength = newColumns[columnId].length;
        newColumns[columnId] = newColumns[columnId].filter((item: Task) => item.id !== itemId);
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
          todo: dashboard.columns.todo || [],
          progress: dashboard.columns.progress || [],
          done: dashboard.columns.done || [],
        },
      });
    }
  },
  moveTaskToIndex: (itemId, fromColumnId, toColumnId, fromIndex, toIndex) => {
    set((state) => {
      const newColumns = { ...state.columns };
      const fromTasks = [...newColumns[fromColumnId]];
      const toTasks = fromColumnId === toColumnId ? fromTasks : [...newColumns[toColumnId]];

      const taskAtIndex = fromTasks[fromIndex];
      if (!taskAtIndex || taskAtIndex.id !== itemId) {
        console.warn("Item mismatch at fromIndex");
        return state;
      }

      const [movedTask] = fromTasks.splice(fromIndex, 1);

      toTasks.splice(toIndex, 0, movedTask);

      newColumns[fromColumnId] = fromTasks;
      if (fromColumnId === toColumnId) {
        newColumns[toColumnId] = toTasks;
      } else {
        newColumns[toColumnId] = toTasks;
      }

      get().saveTasks(newColumns);
      return { columns: newColumns };
    });
  }


}));

export default useTaskStore;
