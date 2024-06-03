const path = require('path')
const fs = require('fs')
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const isDev = (process.env.APP_DEV?.trim() === "true")
const csv = require('csv-parser')
const XLSX = require('xlsx')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const { BDFromXLSB, addNewBD } = require('../src/functions/buyingDecision')
const readTXT = require('../src/functions/readTXT')
const searchSales = require('../src/functions/searchSales')

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

    ipcMain.on('readCSV', (event, filePath) => {
        const rawCSV = []
        fs.createReadStream(filePath)
            .pipe(csv({
                headers: ['Unit', 'Term', 'Year', 'Subject', 'Course_Num', 'Offering_Num', 'Last_Name',
                    'Max_Enr', 'Est_Enr', 'Act_Enr', 'Continuation', 'Evening', 'Extension', 'TN', 'Location', 'Title', 'CRN']
            }))
            .on('data', (data) => rawCSV.push(data))
            .on('end', () => {
                event.sender.send('csvData', rawCSV)
            })
    })

    ipcMain.on('readXLSX', (event, userInput) => {
        const workbook = XLSX.readFile(userInput.XLSXFilePath)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

        event.sender.send('XLSXData', { userInput: userInput, data: jsonData })
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