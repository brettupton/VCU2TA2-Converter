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
                    let term = ""
                    let count = 0
                    fs.createReadStream(filePath)
                        .pipe(csv({
                            headers: ['Campus', 'School', 'Department', 'Section', 'Course Title', 'Instructor', 'Status']
                        }))
                        .on('data', course => {
                            if (course['Campus'] === "Term") {
                                term = course['School'].split(" ")[0]
                            }
                            // Don't include first seven rows - unneeded data
                            if (count > 7) {
                                if (course["Instructor"].indexOf(",") !== -1) {
                                    course["Instructor"] = course["Instructor"].split(",")[0]
                                }

                                if (course["Instructor"] === "No Instructor Assigned") {
                                    course["Instructor"] = "TBD"
                                }

                                //Return only last name or second to last name & last name 
                                const profNameSplit = course["Instructor"].split(' ');
                                if (profNameSplit.length > 2) {
                                    const lastName = profNameSplit[profNameSplit.length - 1].toUpperCase()
                                    const secondToLastName = profNameSplit[profNameSplit.length - 2].toUpperCase()
                                    course["Instructor"] = `${secondToLastName} ${lastName}`
                                } else {
                                    course["Instructor"] = profNameSplit[profNameSplit.length - 1].toUpperCase();
                                }

                                course["Section"] = course["Section"].split("_").join(" ")

                                result[course["Section"]] = {
                                    Title: course["Course Title"],
                                    Professor: course["Instructor"],
                                    Status: course["Status"]
                                }
                            }
                            count++
                        })
                        .on('end', () => {
                            resolve([result, term])
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