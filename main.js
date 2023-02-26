// main.js

const { app, shell, session, BrowserWindow } = require('electron');

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
    // https://www.electronjs.org/docs/latest/api/cookies
    // http://blog.ercanopak.com/how-to-make-theater-mode-the-default-for-youtube/
    // https://medium.com/swlh/building-an-application-with-electron-js-part-2-e62c23e4eb69
    const cookie = { url: 'https://www.youtube.com', name: 'wide', value: '1' }
    session.defaultSession.cookies.set(cookie)
        .then(() => {
            // success
        }, (error) => {
            console.error(error)
        })

    // Open links with External Browser
    // https://stackoverflow.com/a/67409223
    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

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