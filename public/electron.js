const path = require('path')
const fs = require('fs')

const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const isDev = (process.env.APP_DEV?.trim() === "true")
const csv = require('csv-parser')
const XLSX = require('xlsx')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

let win

const createWindow = () => {
    win = new BrowserWindow({
        title: "VCU2TA2Converter",
        width: 800,
        height: 600,
        icon: path.join(__dirname, "BNED-a60fd395.ico"),
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
    // Open the DevTools if dev, remove Menu if not
    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' })
    }

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
}

app.whenReady().then(() => {
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