import { app, BrowserWindow, globalShortcut, ipcMain, Menu } from 'electron';
import * as path from 'path';
import { loadTasks, saveDashboards, saveTasks } from './fileSystem'

let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minHeight: 620,
    minWidth: 1000,
    resizable: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "icons/icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js"),
    },
  })

  if (app.isPackaged) {
    // 'build/index.html'
    mainWindow.loadURL(`file://${__dirname}/../index.html`);
  } else {
    mainWindow.loadURL('http://localhost:3000/index.html');

    mainWindow.webContents.openDevTools();
  }
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.setZoomFactor(1);
    mainWindow.webContents.setZoomLevel(0);
    mainWindow.webContents.setVisualZoomLevelLimits(1, 1);
  });
}

app.whenReady().then(() => {
  createWindow();
  
  //disable manual reload in prod.
  if (app.isPackaged) {
    globalShortcut.register('CommandOrControl+R', () => { });
    globalShortcut.register('F5', () => { });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});

ipcMain.handle("load-tasks", async () => {
  return loadTasks();
});

ipcMain.on("save-tasks", (event, dashboardData, columnData) => {
  saveTasks(dashboardData, columnData);
});

ipcMain.on("save-dashboards", (event, dashboards) => {
  saveDashboards(dashboards);
});

ipcMain.on("show-dashboard-context-menu", (event, dashboardId) => {
  const menu = Menu.buildFromTemplate([
    {
      label: "Edit",
      click: () => {
        event.sender.send("context-menu-command", {
          action: "edit",
          id: dashboardId,
        });
      },
    },
    {
      label: "Delete",
      click: () => {
        event.sender.send("context-menu-command", {
          action: "delete",
          id: dashboardId,
        });
      },
    },
  ]);
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    menu.popup({ window: win });
  }

});