const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');

let mainWindow;
let nextProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: "Emax Typing Software",
    icon: path.join(__dirname, '../public/icon-512x512.png'),
    autoHideMenuBar: true
  });

  const url = isDev ? 'http://localhost:3000' : 'http://localhost:3000';

  if (isDev) {
    mainWindow.loadURL(url);
    mainWindow.webContents.openDevTools();
  } else {
    // In production, we assume next start is already running or we start it
    mainWindow.loadURL(url);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  // Start Next.js server
  const nextCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const nextArgs = isDev ? ['run', 'dev'] : ['run', 'start'];
  
  nextProcess = spawn(nextCmd, nextArgs, {
    cwd: path.join(__dirname, '../'),
    env: { ...process.env, NODE_ENV: isDev ? 'development' : 'production' },
    shell: true
  });

  nextProcess.stdout.on('data', (data) => {
    console.log(`Next.js: ${data}`);
    if (data.toString().includes('ready') || data.toString().includes('started server')) {
       if (!mainWindow) createWindow();
    }
  });

  nextProcess.stderr.on('data', (data) => {
    console.error(`Next.js Error: ${data}`);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (nextProcess) nextProcess.kill();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
