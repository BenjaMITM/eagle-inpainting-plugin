const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const eagle = require('./eagle');
const sdxl = require('./sdxl-api');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

// Handle Eagle API requests from renderer
ipcMain.handle('get-selected-images', async () => {
  return await eagle.getSelectedImages();
});

// Handle SDXL inpaint request from renderer
ipcMain.handle('sdxl-inpaint', async (event, { imagePath, maskDataURL, prompt }) => {
  return await sdxl.inpaint(imagePath, maskDataURL, prompt);
});

// Handle import result to Eagle
ipcMain.handle('import-to-eagle', async (event, filePath) => {
  return await eagle.importImage(filePath);
});

app.whenReady().then(createWindow);