const fs = require('fs')
const csv = require('csv-parser')

class CSV {
    readCSV = (filePath, CSVType = "Enrollment") => {
        switch (CSVType) {
            case "Enrollment":
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
                        })
                })
            case "Adoptions":
                return new Promise((resolve, reject) => {
                    let result = {}
                    fs.createReadStream(filePath)
                        .pipe(csv({
                            headers: ['Campus', 'School', 'Department', 'Section', 'Course Title', 'Instructor', 'Status']
                        }))
                        .on('data', data => {
                            result[data["Section"]] = data

                            delete data["Section"]
                            delete data["School"]
                        })
                        .on('end', () => {
                            resolve(result)
                        })
                        .on('error', (error) => {
                            reject(error)
                        })
                })
            default:
                break
        }

    }
}

module.exports = CSV