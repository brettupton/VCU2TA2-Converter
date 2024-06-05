const path = require('path')
const fs = require('fs')
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const isDev = (process.env.APP_DEV?.trim() === "true")
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const readCSV = require('../src/functions/enrollment/csv')
const { XLSXToCSVArr, matchXLSXToCSV } = require('../src/functions/enrollment/xlsx')
const { BDFromXLSB, addNewBD } = require('../src/functions/decisions/buyingDecision')
const readTXT = require('../src/functions/decisions/readTXT')
const searchSales = require('../src/functions/decisions/searchSales')

try {
    require('electron-reloader')(module, {
        ignore: ['node_modules', 'build']
    });
} catch (err) {
    console.log('Error initializing electron-reloader:', err);
}

let win

const createWindow = () => {
    win = new BrowserWindow({
        title: "OwlGuide",
        width: 800,
        height: 600,
        icon: path.join(__dirname, "owl.ico"),
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#2f3241',
            symbolColor: '#fff',
            height: 60
        },
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

    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' })
    }

    ipcMain.on('max-window', () => {
        win.maximize()
    })

    // ** ENROLLMENT **

    ipcMain.on('format-file-check', (event, enrollInfo) => {
        const { term, year } = enrollInfo

        const basePath = isDev ?
            path.join(__dirname, '..', 'resources', 'formatted') :
            path.join(app.getPath('appData'), 'formatted')
        const formatPath = path.join(basePath, `${term}${year}`)

        if (fs.existsSync(formatPath)) {
            fs.readdir(formatPath, (err, files) => {
                if (err) {
                    console.error("Something went wrong with reading directory: ", err)
                    return
                }
                event.sender.send('format-file-result', { fileExists: true, fileName: files[0] })
            })
        } else {
            event.sender.send('format-file-result', { fileExists: false, fileName: "" })
        }
    })

    ipcMain.on('first-upload', (event, enrollInfo) => {
        console.log("recieved")
        const { term, year, enrollFile } = enrollInfo

        const basePath = isDev ?
            path.join(__dirname, '..', 'resources', 'formatted') :
            path.join(app.getPath('appData'), 'formatted')
        const formatPath = path.join(basePath, `${term}${year}`)

        const XLSXArr = XLSXToCSVArr(term, year, enrollFile.path)

        if (fs.existsSync(formatPath)) {
            fs.readdir(formatPath, (err, files) => {
                if (err) {
                    console.error(err)
                    return
                }
                readCSV(path.join(formatPath, files[0]))
                    .then((CSVArray) => {
                        const matched = matchXLSXToCSV(XLSXArr, CSVArray)
                        event.sender.send('matched', { matched: matched })
                    })
                    .catch(err =>
                        console.error(err)
                    )
            })
        }
    })

    ipcMain.on('createCSVFile', (event, data) => {
        const tempFilePath = path.join(app.getPath('appData'), 'tmp')
        const filePath = path.join(tempFilePath, `${data.fileName}_Formatted.csv`)

        // Check if directory exists, creates it if not
        if (!fs.existsSync(tempFilePath)) {
            fs.mkdirSync(tempFilePath, { recursive: true })
        }

        const csvWriter = createCsvWriter({
            path: filePath,
            header: ['Unit', 'Term', 'Year', 'Subject', 'Course_Num', 'Offering_Num', 'Last_Name',
                'Max_Enr', 'Est_Enr', 'Act_Enr', 'Continuation', 'Evening', 'Extension', 'TN', 'Location', 'Title', 'CRN']
        })

        csvWriter
            .writeRecords(data.data)
            .then(() => {
                dialog.showSaveDialog({
                    defaultPath: path.join(app.getPath('downloads'), `${data.fileName}_Formatted.csv`),
                    filters: [{ name: 'CSV Files', extensions: ['csv'] }]
                }).then(result => {
                    if (!result.canceled && result.filePath) {
                        // Move the temporary file to the chosen file path
                        fs.rename(filePath, result.filePath, (err) => {
                            if (err) {
                                console.error(err)
                            } else {
                                event.sender.send('download-success')
                            }
                        })
                    } else {
                        // User canceled the file save, remove the temporary file
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error(err)
                            } else {
                                console.log('Temp file removed')
                            }
                        });
                    }
                }).catch(err => event.sender.send('CSV-error', err))
            })
            .catch((err) => event.sender.send('CSV-error', err))
    })

    // ** BUYING DECISION **

    ipcMain.on('BDExcel', (event, filePath) => {
        const BDJSON = addNewBD(filePath)

        event.sender.send('ExcelData', { data: BDJSON })
    })

    ipcMain.on('bd-file', (event, fileInfo) => {
        const { path, extension } = fileInfo

        switch (extension) {
            case "txt":
                readTXT(path)
                    .then((txtBD) => {
                        const { newBD, Fall } = addNewBD(txtBD)
                        event.sender.send('bd-data', { BD: newBD, sales: Fall })
                    })
                break
            case "xlsb":
                const jsonBD = BDFromXLSB(path)
                const { newBD, Fall } = addNewBD(jsonBD)
                event.sender.send('bd-data', { BD: newBD, sales: Fall })
                break
            default:
                break
        }
    })

    ipcMain.on('search-sales', (event, { parameter, searchInfo }) => {
        const result = searchSales(parameter, searchInfo)

        event.sender.send('search-result', { result: result })
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