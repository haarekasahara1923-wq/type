const { app, BrowserWindow } = require('electron');
const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = !app.isPackaged;

// ── Database & Engine Path Logic ──
// ── Production Environment Setup ──
if (!dev) {
  const appRoot = app.getAppPath().replace('app.asar', 'app.asar.unpacked');
  const userDataPath = app.getPath('userData');
  const dbDir = path.join(userDataPath, 'database');
  const dbPath = path.join(dbDir, 'dev.db');
  const templateDbPath = path.join(appRoot, 'prisma', 'dev.db');

  console.log('[Electron] Production Mode Detected');
  console.log('[Electron] App Root:', appRoot);
  console.log('[Electron] UserData Path:', userDataPath);

  // 1. Database Setup
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  if (!fs.existsSync(dbPath) && fs.existsSync(templateDbPath)) {
    fs.copyFileSync(templateDbPath, dbPath);
    console.log('[Electron] Database initialized at:', dbPath);
  } else if (fs.existsSync(dbPath)) {
    console.log('[Electron] Database already exists at:', dbPath);
  } else {
    console.error('[Electron] FATAL: template DB not found at', templateDbPath);
  }

  const normalizedDbPath = dbPath.replace(/\\/g, '/');
  process.env.DATABASE_URL = `file:${normalizedDbPath}`;

  // 2. Prisma Engine Detection
  // Check common locations: .prisma/client, @prisma/client, or root node_modules
  const searchPaths = [
    path.join(appRoot, 'node_modules', '.prisma', 'client'),
    path.join(appRoot, 'node_modules', '@prisma', 'client'),
    path.join(appRoot, 'node_modules', 'prisma')
  ];

  let engineFound = false;
  for (const dir of searchPaths) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      // Look for query engine file (e.g., query_engine-windows.dll.node or similar)
      const engineFile = files.find(f => 
        (f.includes('query_engine') || f.includes('schema-engine')) && 
        (f.endsWith('.node') || f.endsWith('.dll.node'))
      );
      
      if (engineFile) {
        const fullPath = path.resolve(path.join(dir, engineFile));
        process.env.PRISMA_QUERY_ENGINE_LIBRARY = fullPath;
        console.log('[Electron] Prisma Engine Found at:', fullPath);
        engineFound = true;
        break;
      }
    }
  }

  if (!engineFound) {
    console.error('[Electron] FATAL: Prisma query engine NOT found. DB operations will fail.');
  }


  // 3. NextAuth & Mode Setup
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
