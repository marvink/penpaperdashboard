// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
const {app, BrowserWindow, Menu, protocol, ipcMain} = require('electron');
import createWindow from "./helpers/window";
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");
import env from "env";

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

app.on("ready", () => {
  mainWindow = createWindow("main", {
    width: 1920,
    height: 1024, 
    autoHideMenuBar: true
  });

  mainWindow.loadURL(`file://${__dirname}/app.html#v${app.getVersion()}`);

  if (env.name === "development") {
    mainWindow.openDevTools();
  }
  if (env.name === 'production') {
    autoUpdater.checkForUpdates();
  }

});

app.on("window-all-closed", () => {
  app.quit();
});

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
  autoUpdater.quitAndInstall();
});

app.on('window-all-closed', () => {
  app.quit();
});

