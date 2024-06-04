const XLSX = require('xlsx')

const XLSXToCSVArr = (term, year, filePath) => {
    const workbook = XLSX.readFile(filePath)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonXLSX = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

    const csvArray = []
    for (const course of jsonXLSX) {
        const newCourse = {
            "Unit": course["CAMPUS"] === "MPC" ? 1 : 2,
            "Term": term === "Fall" ? term === "Spring" ? "F" : "W" : "A",
            "Year": year,
            "Subject": course["SUBJECT"],
            "Course_Num": course["COURSE NUMBER"].toString().padStart(3, "0"),
            "Offering_Num": course["OFFERING NUMBER"].toString().padStart(3, "0"),
            "Last_Name": course["PRIMARY INSTRUCTOR LAST NAME"].length > 0 ? course["PRIMARY INSTRUCTOR LAST NAME"].toUpperCase() : "TBD",
            "Max_Enr": course["MAXIMUM ENROLLMENT"].toString(),
            "Est_Enr": course["MAXIMUM ENROLLMENT"].toString(),
            "Act_Enr": course["ACTUAL ENROLLMENT"].toString(),
            "Continuation": "",
            "Evening": "",
            "Extension": "",
            "TN": "",
            "Location": "",
            "Title": course["TITLE"],
            "CRN": course["COURSE REFERENCE NUMBER"].toString()
        }
        csvArray.push(newCourse)
    }
    return csvArray
}

const matchXLSXToCSV = (json, csv) => {
    const matchedArr = []

    const csvLookup = csv.reduce((acc, course) => {
        acc[course["CRN"]] = course
        return acc
    }, {})


    for (const course of json) {
        const CRN = course["CRN"]
        const matchedCSV = csvLookup[CRN]

        if (course["Offering_Num"] === "000") {
            if (matchedCSV) {
                course["Offering_Num"] = matchedCSV["Offering_Num"]
            }
        }

        matchedArr.push(course)
    }

    return matchedArr
}

module.exports = { XLSXToCSVArr, matchXLSXToCSV }