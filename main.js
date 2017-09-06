const electron = require('electron');
const express = require('express');
const window = require('electron-window');
const path = require('path');
const fs = require('fs');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Command Line Parser
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'dev-tools', alias: 'd', type: Boolean },
    { name: 'clear-storage-data', alias: 'S', type: Boolean },
];

const options = commandLineArgs(optionDefinitions);
const RESOURCES = path.join(__dirname, "resources");
const ARGS = {};

console.log(`Resources directory: ${RESOURCES}`);

ARGS.config = require('./config') || {};

// Check if data directory exists, and try to create it if it doesn't
if(!fs.existsSync(ARGS.config.dataDirectory)) {
  fs.mkdirSync(ARGS.config.dataDirectory);
}

function createWindow () {
    // initialize express
    var app = express();

    // Create the browser window.
    const mainWindow = window.createWindow({
      minWidth: 1000,
      minHeight: 800,
      title: "ManuScript Digital Journal",
      // todo: set icon dependent on OS
      icon: path.join(RESOURCES, "images", "Application256.png"),
      // backgroundColor: "#000000"
    })

    // Maximize window   on start
    mainWindow.maximize();

    // Send the configuration via ARGS on initial page load -
    // ARGS will NOT be sent in every request, save off what you need
    mainWindow.showUrl(path.join(__dirname, 'resources', 'index.html'), ARGS, () => {
      console.log('window is now visible!')
    });

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      // mainWindow = null /* No longer required due to electron-window */
    });

    //Clear Storage Data
    if (options['clear-storage-data']) {
      mainWindow.webContents.session.clearStorageData();
    }

    //Open Developer Tools
    if (options['dev-tools']) {
      mainWindow.webContents.openDevTools();
    }
} // END CREATE_WINDOW

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
