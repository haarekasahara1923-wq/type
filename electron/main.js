const { app, BrowserWindow } = require('electron');
const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = !app.isPackaged;

if (!dev) {
  // In production, point Prisma to the unpacked database file
  const dbPath = path.join(app.getAppPath().replace('app.asar', 'app.asar.unpacked'), 'prisma/dev.db');
  process.env.DATABASE_URL = `file:${dbPath}`;
}

const nextApp = next({ dev, dir: path.join(__dirname, '../') });
const handle = nextApp.getRequestHandler();

let mainWindow;

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

  mainWindow.loadURL('http://localhost:3000');

  if (dev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  nextApp.prepare().then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
      createWindow();
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

