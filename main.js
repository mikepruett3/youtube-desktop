// main.js

const { app, BrowserWindow } = require('electron');

// Disable Hardware Acceleration
// https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering
app.disableHardwareAcceleration()

createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        title: 'YouTube Desktop',
        icon: __dirname + '/images/YouTube.ico',
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            webviewTag: true,
            nodeIntegration: true,
            nativeWindowOpen: true,
        }
    });

    // Create a Cookie, so that Theater Mode is allways enabled.
    let code = `
    document.cookie = 'wide=1; expires='+new Date('3099').toUTCString()+'; path=/';
    `;
    win.webContents.executeJavaScript(code);

    win.loadURL(`https://www.youtube.com/feed/subscriptions`);
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});