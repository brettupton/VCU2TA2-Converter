
const matchUserOfferings = (enroll, offering) => {
    const courses = []

    enroll.forEach(course => {
        const CRN = course["CRN"]
        if (offering[CRN]) {
            course["Offering_Num"] = offering[CRN];
        }

        courses.push(course)
    })
    return courses
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

module.exports = { matchUserOfferings, matchXLSXToCSV }
