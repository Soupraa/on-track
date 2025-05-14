import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import * as path from 'path';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { loadTasks, saveDashboards, saveTasks } from './fileSystem'

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    minHeight: 620,
    minWidth: 1000,
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

    // Hot Reloading on 'node_modules/.bin/electronPath'
    //   require('electron-reload')(__dirname, {
    //     electron: path.join(__dirname,
    //       '..',
    //       '..',
    //       'node_modules',
    //       '.bin',
    //       'electron' + (process.platform === "win32" ? ".cmd" : "")),
    //     forceHardReset: true,
    //     hardResetMethod: 'exit'
    //   });
    // }
  }
}

app.whenReady().then(() => {
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  createWindow();

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
  console.log("loading tasks")
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