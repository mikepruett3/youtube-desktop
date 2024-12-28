// main.js

// https://www.electronforge.io/config/makers/squirrel.windows
if (require('electron-squirrel-startup')) return;

const { app, shell, session, BrowserWindow, Menu, Tray, nativeImage, dialog } = require('electron')
const { getHA, setHA } = require('./settings.js');

const { ElectronBlocker } = require('@ghostery/adblocker-electron');
const fetch = require('cross-fetch'); // required 'fetch'

// Disable Hardware Acceleration
// https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering
if (!getHA()) {
    app.disableHardwareAcceleration()
}

createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        title: 'YouTube Desktop',
        icon: __dirname + '/images/YouTube.png',
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: true,
            webviewTag: true,
            nativeWindowOpen: true
        }
    });

    win.loadURL(`https://www.youtube.com/feed/subscriptions`);

    ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
        blocker.enableBlockingInSession(session.defaultSession);
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

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Hardware Acceleration',
            type: 'checkbox',
            checked: getHA(),
            click({ checked }) {
                setHA(checked)
                dialog.showMessageBox(
                    null,
                    {
                        type: 'info',
                        title: 'info',
                        message: 'Exiting Applicatiom, as Hardware Acceleration setting has been changed...'
                    })
                    .then(result => {
                      if (result.response === 0) {
                        app.relaunch();
                        app.exit()
                      }
                    }
                )
            }
        },
        {
            label: 'Clear Cache',
            click: () => {
                session.defaultSession.clearStorageData()
                app.relaunch();
                app.exit();
            }
        },
        {
            label: 'Reload',
            click: () => win.reload()
        },
        {
            label: 'Quit',
            type: 'normal',
            role: 'quit'
        }
    ])

    let tray = null
    if (process.platform == 'darwin') {
        const icon = nativeImage.createFromPath(__dirname + '/images/YouTube.icns')
        tray = new Tray(icon)
    } else if (process.platform == 'win32') {
        const icon = nativeImage.createFromPath(__dirname + '/images/YouTube.ico')
        tray = new Tray(icon)
    } else if (process.platform == 'linux') {
        const icon = nativeImage.createFromPath(__dirname + '/images/YouTube.png')
        tray = new Tray(icon)
    }

    tray.setToolTip('YouTube Desktop')
    tray.setTitle('YouTube Desktop')
    tray.setContextMenu(contextMenu)
};

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
