const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

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

const createCSV = (file, data) => {
    const newFile = path.join(file.dir, `${file.name}_Formatted.csv`);

    return new Promise((resolve, reject) => {
        const csvWriter = createCsvWriter({
            path: newFile,
            header: Object.keys(data[0])
        });

        csvWriter.writeRecords(data)
            .then(() => {
                fs.readdir(file.dir, (err, files) => {
                    if (err) {
                        reject(err)
                    }
                    fs.unlink(path.join(file.dir, files[0]), (err) => {
                        if (err) { reject(err) }
                    })
                })
                resolve()
            })
            .catch((err) => reject(err))
    });
};

module.exports = { readCSV, createCSV }