// main.js

// https://www.electronforge.io/config/makers/squirrel.windows
if (require('electron-squirrel-startup')) return;

const { app, shell, session, BrowserWindow, Menu, Tray, nativeImage, dialog } = require('electron')
const { getHA, setHA } = require('./settings.js');

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
            webSecurity: true,
            contextIsolation: true,
            webviewTag: true,
            nodeIntegration: true,
            nativeWindowOpen: true
        }
    });

    win.loadURL(`https://www.youtube.com/feed/subscriptions`);

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

    let tray = null
    var opsys = process.platform;
    if (opsys == "darwin") {
        const icon = nativeImage.createFromPath(__dirname + '/images/YouTube.icns');
    } else if (opsys == "win32") {
        const icon = nativeImage.createFromPath(__dirname + '/images/YouTube.ico');
    } else if (opsys == "linux") {
        const icon = nativeImage.createFromPath(__dirname + '/images/YouTube.png');
    }
    tray = new Tray(icon)

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