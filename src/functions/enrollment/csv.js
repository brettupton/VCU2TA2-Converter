const fs = require('fs')
const csv = require('csv-parser')

const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const rawCSV = []
        fs.createReadStream(filePath)
            .pipe(csv({
                headers: ['Unit', 'Term', 'Year', 'Subject', 'Course_Num', 'Offering_Num', 'Last_Name',
                    'Max_Enr', 'Est_Enr', 'Act_Enr', 'Continuation', 'Evening', 'Extension', 'TN', 'Location', 'Title', 'CRN']
            }))
            .on('data', (data) => rawCSV.push(data))
            .on('end', () => {
                resolve(rawCSV)
            })
            .on('error', (error) => {
                reject(error)
            });
    });
}


module.exports = readCSV