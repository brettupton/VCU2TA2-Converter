const XLSX = require('xlsx')

const XLSXToCSVArr = (term, year, filePath) => {
    const workbook = XLSX.readFile(filePath)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonXLSX = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

    const csvArray = []
    for (const course of jsonXLSX) {
        const newCourse = {
            "Unit": course["CAMPUS"] === "MPC" ? 1 : 2,
            "Term": term === "Fall" ? "F" : term === "Spring" ? "W" : term === "Summer" ? "A" : "",
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

module.exports = XLSXToCSVArr