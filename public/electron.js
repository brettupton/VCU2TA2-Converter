const path = require('path')
const fs = require('fs')
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const isDev = (process.env.APP_DEV?.trim() === "true")
const XLSXToCSVArr = require('../src/functions/enrollment/xlsx')
const { matchUserOfferings, matchXLSXToCSV } = require('../src/functions/enrollment/match')
const searchISBN = require('../src/functions/decisions/searchISBN')
const matchPrevAdoptions = require('../src/functions/adoptions/match')
const CSV = require('../src/classes/CSV')
const TXT = require('../src/classes/TXT')


try {
    require('electron-reloader')(module, {
        ignore: ['node_modules', 'build', 'src/stores/**/*']
    });
} catch (err) {
    console.log('Error initializing electron-reloader:', err);
}

let win

const csv = new CSV()
const txt = new TXT()
const srcPath = path.join(__dirname, '../src')
const devFormatPath = path.join(__dirname, '..', 'resources', 'formatted')

const createWindow = async () => {
    win = new BrowserWindow({
        title: "OwlGuide",
        width: 830,
        height: 630,
        icon: path.join(__dirname, "owl.ico"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        },
    })

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, 'index.html')}`
    )

    try {
        const contextMenu = await import('electron-context-menu')
        contextMenu.default({
            window: win
        })
    } catch (error) {
        console.error('Error loading electron-context-menu:', error)
    }

    ipcMain.on('max-window', () => {
        win.maximize()
    })

    ipcMain.on('error', (event, data) => {
        dialog.showErrorBox("Error", data.text)
    })

    ipcMain.on('store-check', (event) => {
        if (global.store) {
            event.sender.send('store-found', { store: global.store })
        }
    })

    ipcMain.on('store-change', (event, data) => {
        global.store = data.store
    })

    // ** ENROLLMENT **

    ipcMain.on('format-file-check', (event, enrollInfo) => {
        const { term, year } = enrollInfo

        const basePath = isDev ?
            devFormatPath :
            path.join(app.getPath('appData'), 'formatted')
        const formatDir = path.join(basePath, `${term}${year}`)

        if (fs.existsSync(formatDir)) {
            fs.readdir(formatDir, (err, files) => {
                if (err) {
                    console.error("Something went wrong with reading directory: ", err)
                    return
                }
                if (files.length > 0) {
                    event.sender.send('format-file-result', { fileExists: true, fileName: files[0] })
                } else {
                    event.sender.send('format-file-result', { fileExists: false, fileName: "" })
                }
            })
        } else {
            fs.mkdir(formatDir, { recursive: true }, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
                event.sender.send('format-file-result', { fileExists: false, fileName: "" })
            })
        }
    })

    ipcMain.on('first-submit', (event, enrollInfo) => {
        const { term, year, enrollFile, formatFile } = enrollInfo

        const basePath = isDev ?
            devFormatPath :
            path.join(app.getPath('appData'), 'formatted')
        const formatDir = path.join(basePath, `${term}${year}`)

        const XLSXArr = XLSXToCSVArr(term, year, enrollFile.path)

        if (fs.existsSync(formatDir)) {
            fs.readdir(formatDir, (err, files) => {
                if (err) {
                    console.error(err)
                    return
                }
                if (files.length > 0) {
                    csv.readCSV(path.join(formatDir, files[0]), "Enrollment")
                        .then((CSVArray) => {
                            const matched = matchXLSXToCSV(XLSXArr, CSVArray)
                            event.sender.send('matched', { matched: matched })
                        })
                        .catch(err =>
                            console.error(err)
                        )
                } else {
                    if (formatFile.path === "") {
                        event.sender.send('matched', { matched: XLSXArr })
                    } else {
                        csv.readCSV(formatFile.path, "Enrollment")
                            .then((CSVArray) => {
                                const matched = matchXLSXToCSV(XLSXArr, CSVArray)
                                event.sender.send('matched', { matched: matched })
                            })
                            .catch(err =>
                                console.error(err)
                            )
                    }
                }
            })
        }
    })

    ipcMain.on('second-submit', (event, data) => {
        const { enroll, offering, fileName } = data

        const term = enroll[0]["Term"]
        const year = enroll[0]["Year"]

        const basePath = isDev ?
            devFormatPath :
            path.join(app.getPath('appData'), 'formatted')
        const formatDir = path.join(basePath, `${term}${year}`)

        const fullEnroll = matchUserOfferings(enroll, offering)

        csv.createCSV({ name: fileName, dir: formatDir }, fullEnroll)
            .then(() => {
                dialog.showSaveDialog({
                    defaultPath: path.join(app.getPath('downloads'), `${data.fileName}_Formatted.csv`),
                    filters: [{ name: 'CSV Files', extensions: ['csv'] }]
                })
                    .then(saveResult => {
                        if (!saveResult.cancelled && saveResult.filePath) {
                            fs.copyFile(path.join(formatDir, `${fileName}_Formatted.csv`), saveResult.filePath, (err) => {
                                if (err) { console.error(err) }
                                event.sender.send('download-success')
                            })
                        } else {
                            fs.unlink(path.join(app.getPath('downloads'), `${data.fileName}_Formatted.csv`), (err) => {
                                if (err) { console.error(err) }
                            })
                        }
                    })
                    .catch(err => {
                        console.error(err)
                    })
            })
    })

    // ** BUYING DECISION **

    ipcMain.on('bd-file', (event, { file }) => {
        const date = new Date().toISOString().split('T')[0]
        const bdPath = path.join(srcPath, 'stores', `${global.store}`, 'bd')

        txt.readBD(file.path)
            .then(([newBD, changeBD, term, latestDate]) => {
                const bdTermPath = path.join(bdPath, term)

                // Create buying decision directory for term specified, if it does not already exist
                if (!fs.existsSync(bdTermPath)) {
                    fs.mkdir(bdTermPath, { recursive: true }, (err) => {
                        if (err) {
                            dialog.showErrorBox("Error", "Something went wrong with creating new BD directory")
                            console.error(err)
                        }
                    })
                }

                fs.writeFileSync(path.join(bdTermPath, `${date}.json`), JSON.stringify(newBD, null, 4), 'utf8', err => {
                    if (err) {
                        console.error(err)
                    }

                })
                event.sender.send('bd-data', { BD: newBD, changeBD: changeBD, term: term, latestDate: latestDate.split(".")[0] })
            })
            .catch((err) => { console.error(err) })
    })

    ipcMain.on('search-isbn', (event, { ISBN, Title, term }) => {
        const result = searchISBN(ISBN, Title, term)

        event.sender.send('search-result', { result: result })
    })

    // ** ADOPTIONS ** 

    ipcMain.on('adoption-upload', (event, adoptionFile) => {
        csv.readCSV(adoptionFile.path, "Adoptions")
            .then(([result, term]) => {
                const prevAdoptions = matchPrevAdoptions(result, term)

                event.sender.send('unsubmitted', { unsubmitted: prevAdoptions, term: term })
            })
    })

    // ** DEV **
    ipcMain.on('dev-check', (event) => {
        event.sender.send('is-dev', { isDev })
    })

    ipcMain.on('new-sales', (event, data) => {
        const storePath = path.join(srcPath, 'stores', `${data.store}`)
        const termPath = path.join(storePath, 'sales', `${data.term}.json`)

        if (!fs.existsSync(storePath)) {
            fs.mkdir(path.join(storePath, 'sales'), { recursive: true }, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        }

        txt.readAllSales(data.path)
            .then((sales) => {
                fs.writeFile(termPath, JSON.stringify(sales, null, 4), 'utf8', err => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    dialog.showMessageBox(win,
                        {
                            type: "info",
                            title: "OwlGuide",
                            message: `Upload for store ${data.store} successful`
                        })
                })
            })
    })
}

app.whenReady().then(() => {
    if (isDev) {
        const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
        installExtension(REACT_DEVELOPER_TOOLS)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err));
    }
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})