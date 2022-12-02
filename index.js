const { app, BrowserWindow } = require('electron');

if (require('electron-squirrel-startup')) {
    app.quit();
}


const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        icon: __dirname + '/src/icon/icon.ico',

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadFile(__dirname + '/index.html');
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


// electron-packager . cipher_decipher --overwrite --asar=true --platform=win32 --arch=ia32 --icon=src/icon/icon.ico --prune=true --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName="cipher_decipher"
// electron-packager . lab4 --overwrite --asar=true --platform=win32 --arch=x64 --icon=src/icon/icon.ico --prune=true --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName="lab4"