const path = require('path')
const fs = require('fs')

const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const isDev = require('electron-is-dev')
const csv = require('csv-parser')
const XLSX = require('xlsx')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

let win

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        },
    })

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    )
    // Open the DevTools.
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
        const filePath = path.join('resources', 'tmp', `${data.fileName}_Formatted.csv`)

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
                }).catch(err => console.error(err))
            })
            .catch((error) => console.error('Error writing CSV file: ', error))
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