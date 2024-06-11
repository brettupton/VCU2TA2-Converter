const path = require('path')
const fs = require('fs')
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const isDev = (process.env.APP_DEV?.trim() === "true")
const { readCSV, createCSV } = require('../src/functions/enrollment/csv')
const XLSXToCSVArr = require('../src/functions/enrollment/xlsx')
const { BDFromXLSB, addNewBD } = require('../src/functions/decisions/buyingDecision')
const readTXT = require('../src/functions/decisions/readTXT')
const searchSales = require('../src/functions/decisions/searchSales')
const { matchUserOfferings, matchXLSXToCSV } = require('../src/functions/enrollment/match')
const CSV = require('../src/classes/CSV')
const matchPrevAdoptions = require('../src/functions/adoptions/match')

try {
    require('electron-reloader')(module, {
        ignore: ['node_modules', 'build']
    });
} catch (err) {
    console.log('Error initializing electron-reloader:', err);
}

let win

const csv = new CSV()

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

    // Dynamically import electron-context-menu
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

    // ** ENROLLMENT **

    ipcMain.on('format-file-check', (event, enrollInfo) => {
        const { term, year } = enrollInfo

        const basePath = isDev ?
            path.join(__dirname, '..', 'resources', 'formatted') :
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
            path.join(__dirname, '..', 'resources', 'formatted') :
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
                    readCSV(path.join(formatDir, files[0]))
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
                        readCSV(formatFile.path)
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

        console.log(enroll[0]["Term"])
        const term = enroll[0]["Term"]
        const year = enroll[0]["Year"]

        const basePath = isDev ?
            path.join(__dirname, '..', 'resources', 'formatted') :
            path.join(app.getPath('appData'), 'formatted')
        const formatDir = path.join(basePath, `${term}${year}`)

        const fullEnroll = matchUserOfferings(enroll, offering)

        createCSV({ name: fileName, dir: formatDir }, fullEnroll)
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

    ipcMain.on('bd-file', (event, fileInfo) => {
        const { path, extension } = fileInfo

        switch (extension) {
            case "txt":
                readTXT(path)
                    .then(([term, txtBD]) => {
                        const [newBD, Sales] = addNewBD(term, txtBD)
                        event.sender.send('bd-data', { BD: newBD, sales: Sales, term: term })
                    })
                break
            case "xlsb":
                const jsonBD = BDFromXLSB(path)
                const [newBD, Sales] = addNewBD(jsonBD)
                event.sender.send('bd-data', { BD: newBD, sales: Sales })
                break
            default:
                break
        }
    })

    ipcMain.on('search-sales', (event, { parameter, searchInfo }) => {
        const result = searchSales(parameter, searchInfo)

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