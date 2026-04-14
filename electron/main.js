const { app, BrowserWindow } = require('electron');
const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = !app.isPackaged;

// ── Database & Engine Path Logic ──
if (!dev) {
  const appRoot = app.getAppPath().replace('app.asar', 'app.asar.unpacked');
  
  // 1. Move DB to UserData (AppData/Roaming) to avoid permission issues
  const userDataPath = app.getPath('userData');
  const dbDir = path.join(userDataPath, 'database');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  
  const dbPath = path.join(dbDir, 'dev.db');
  const templateDbPath = path.join(appRoot, 'prisma', 'dev.db');

  // Copy template DB to userData if it doesn't exist yet
  if (!fs.existsSync(dbPath) && fs.existsSync(templateDbPath)) {
    fs.copyFileSync(templateDbPath, dbPath);
    console.log('[Electron] Database copied to userData:', dbPath);
  }

  process.env.DATABASE_URL = `file:${dbPath}`;

  // 2. Prisma Engine Path detection
  const prismaClientDir = path.join(appRoot, 'node_modules', '.prisma', 'client');
  if (fs.existsSync(prismaClientDir)) {
    const files = fs.readdirSync(prismaClientDir);
    const engineFile = files.find(f => f.endsWith('.dll.node') || f.endsWith('.node'));
    if (engineFile) {
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = path.join(prismaClientDir, engineFile);
    }
  }

  // 3. Essential Env Vars
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
  process.env.NEXTAUTH_URL_INTERNAL = 'http://localhost:3000';
  process.env.NODE_ENV = 'production';
  if (!process.env.NEXTAUTH_SECRET) process.env.NEXTAUTH_SECRET = 'emax-typing-secret-123';
}

const nextApp = next({ dev, dir: path.join(__dirname, '../') });
const handle = nextApp.getRequestHandler();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: "Emax Typing Software",
    icon: path.join(__dirname, '../public/icon-512x512.png'),
    autoHideMenuBar: true,
  });

  mainWindow.loadURL('http://localhost:3000');
}

app.on('ready', () => {
  nextApp.prepare().then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(3000, (err) => {
      if (err) throw err;
      createWindow();
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
