const { app, BrowserWindow } = require('electron');
const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = !app.isPackaged;

if (!dev) {
  // ── Production: fix all Prisma paths so SQLite works in the packaged app ──

  // 1. Point DATABASE_URL to the unpacked DB file
  const appRoot = app.getAppPath().replace('app.asar', 'app.asar.unpacked');
  const dbPath = path.join(appRoot, 'prisma', 'dev.db');
  process.env.DATABASE_URL = `file:${dbPath}`;
  console.log('[Electron] DATABASE_URL set to:', process.env.DATABASE_URL);

  // 2. Tell Prisma exactly where its native query-engine binary lives
  //    (electron-builder unpacks it to app.asar.unpacked)
  const prismaDir = path.join(appRoot, 'node_modules', '.prisma', 'client');
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = path.join(prismaDir, 'libquery_engine-windows.dll.node');
  console.log('[Electron] PRISMA_QUERY_ENGINE_LIBRARY set to:', process.env.PRISMA_QUERY_ENGINE_LIBRARY);

  // 3. Force NextAuth to localhost — prevents redirects to Vercel when online
  process.env.NEXTAUTH_URL          = 'http://localhost:3000';
  process.env.NEXTAUTH_URL_INTERNAL = 'http://localhost:3000';

  // 4. Ensure NEXTAUTH_SECRET is available in packaged app
  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = 'emax-offline-secret-xyz-123jgjglkjlkjgkjgkjjkk';
  }

  // 5. Set NODE_ENV so Next.js behaves correctly
  process.env.NODE_ENV = 'production';
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

  // Open DevTools in dev mode for debugging
  if (dev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  nextApp
    .prepare()
    .then(() => {
      createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      }).listen(3000, (err) => {
        if (err) throw err;
        console.log('> Next.js ready on http://localhost:3000');
        createWindow();
      });
    })
    .catch((err) => {
      console.error('[Electron] Failed to start Next.js server:', err);
      app.quit();
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
