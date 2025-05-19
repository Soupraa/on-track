import { create } from "zustand";
import { Dashboard } from "./useDashboardStore";
interface AppState {
    isLightMode: boolean;
    loadAppData: () => void;
    setIsLightMode: (isLight: boolean) => void;
}

interface SavedData {
    isLightMode: boolean;
    dashboards: Dashboard[];
}

const useAppStore = create<AppState>((set, get) => {

    const loadAppFromDisk = async (): Promise<any> => {
        try {
            const data: AppState = await window.electronAPI?.getAppState();
            return data ? data : {};
        } catch (error) {
            console.error("Failed to get app data", error);
            return {};
        }
    };

    return {
        isLightMode: false,
        loadAppData: async () => {
            const data: SavedData = await loadAppFromDisk();
            set({ isLightMode: data.isLightMode })
        },
        setIsLightMode: (isLight: boolean) => {
            set({ isLightMode: isLight });
            window.electronAPI?.saveSettings({ isLightMode: isLight }); 
            return;
        }
    }
})

export default useAppStore;