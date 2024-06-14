const fs = require('fs')

class TXT {
    cleanFile = (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf-8', (err, data) => {
                if (err) {
                    reject(err)
                }

                const lines = data.split("\n")
                let header

                // This is always true no matter the different manager report
                const termLine = lines[7].trim()
                const term = termLine.charAt(termLine.length - 3)

                // Find third instance of 'Page: 1'
                // Everything before is irrelevant
                let count = 0
                let pageOneIndex = -1
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes('Page: 1')) {
                        count++
                        if (count === 3) {
                            pageOneIndex = i
                            break
                        }
                    }
                }

                // Third page 1 and last two lines (*** End of Report *** and blank)
                const finalData = lines.slice(pageOneIndex + 1, lines.length - 2)

                // Remove dash line, header and extraneous TA2 data
                for (let i = 0; i < finalData.length; i++) {
                    if ((/^-+$/).test(finalData[i].trim())) {
                        header = finalData[i - 1]
                        const patternStartIndex = Math.max(0, i - 5)
                        const patternEndIndex = i + 1
                        finalData.splice(patternStartIndex, patternEndIndex - patternStartIndex);
                        // Adjust the loop index to continue checking after the removed section
                        i = patternStartIndex - 1
                    }
                }

                // Calculate where to split lines by looking at header
                const headerTerms = header.trim().split(/\s+/)
                const headerIndices = []

                for (let i = 0; i < headerTerms.length; i++) {
                    const currTerm = headerTerms[i]

                    headerIndices.push(header.indexOf(currTerm))
                }

                resolve([term, headerIndices, finalData])
            })
        })
    }

    readAllSales = async (path) => {
        const allSales = {}
        return this.cleanFile(path)
            .then(([term, headerIndices, finalData]) => {

                // Loop through and consolidate data per ISBN
                finalData.forEach((line) => {
                    const Term = line.substring(headerIndices[0], headerIndices[1]).trim()
                    const Course = line.substring(headerIndices[1], headerIndices[2]).trim()
                    const Title = line.substring(headerIndices[2], headerIndices[3]).trim()
                    const ISBN = line.substring(headerIndices[3], headerIndices[4]).trim().replace(/-/g, '')
                    const Enrl = parseInt(line.substring(headerIndices[4], headerIndices[5]))
                    const Sales = parseInt(line.substring(headerIndices[5], headerIndices[6]))

                    if (ISBN.startsWith('822') || Title.startsWith('EBK')) {
                        return
                    }

                    if (!allSales[ISBN]) {
                        allSales[ISBN] = {
                            Title: Title,
                            Semesters: {},
                            totalSales: 0,
                            totalEnrl: 0,
                            avgSE: 0
                        }
                    }

                    if (!allSales[ISBN]["Semesters"][Term]) {
                        allSales[ISBN]["Semesters"][Term] = {
                            Courses: [],
                            Enrl: null,
                            Sales: null
                        }
                    }

                    // Count sections only and keep track of dept/course
                    const existingCourseIndex = allSales[ISBN]["Semesters"][Term].Courses.findIndex(course => course.Course === Course)
                    if (existingCourseIndex === -1) {
                        allSales[ISBN]["Semesters"][Term].Courses.push({ Course: Course.trim(), Sections: 1 })
                    } else {
                        allSales[ISBN]["Semesters"][Term].Courses[existingCourseIndex].Sections++
                    }

                    // Add to totalSales and totalEnrl only on first ISBN
                    if (allSales[ISBN]["Semesters"][Term].Enrl === null && allSales[ISBN]["Semesters"][Term].Sales === null) {
                        allSales[ISBN].totalSales += Sales
                        allSales[ISBN].totalEnrl += Enrl
                        allSales[ISBN]["Semesters"][Term].Enrl = Enrl
                        allSales[ISBN]["Semesters"][Term].Sales = Sales
                    }

                    allSales[ISBN].avgSE = allSales[ISBN].totalEnrl > 0 ? (allSales[ISBN].totalSales / allSales[ISBN].totalEnrl).toFixed(4) : 0
                })
                return allSales
            })
            .catch((err) => {
                console.error(err)
            })
    }

    readBD = async (path) => {
        return this.cleanFile(path)
            .then(([term, headerIndices, finalData]) => {
                const BD = {}

                finalData.forEach(line => {
                    const Title = line.substring(headerIndices[0], headerIndices[1]).trim()
                    const ISBN = (line.substring(headerIndices[1], headerIndices[2]).trim()).replace(/-/g, '')
                    const Enrollment = parseInt(line.substring(headerIndices[2], headerIndices[3]).trim())
                    const Decision = parseInt(line.substring(headerIndices[3], headerIndices[4]).trim())

                    if (ISBN.startsWith('822') || Title.startsWith('EBK')) {
                        return
                    }

                    if (!BD[ISBN]) {
                        BD[ISBN] = { Title, Enrollment, Decision }
                    }
                })

                const prevSales = require(`../stores/${global.store}/sales/${term}.json`)

                const newBD = {}

                for (const ISBN in BD) {
                    const pastSales = prevSales[ISBN]
                    const currBook = BD[ISBN]
                    const newCalc = pastSales ? Math.ceil(currBook.Enrollment * pastSales.avgSE) : Math.ceil(currBook.Enrollment / 5)

                    newBD[ISBN] = {
                        Title: currBook.Title,
                        Enrollment: currBook.Enrollment,
                        Decision: currBook.Decision,
                        CalcBD: term === 'A' ? Math.max(1, newCalc) : newCalc,
                        Diff: Math.abs(currBook.Decision - newCalc)
                    }
                }
                return [newBD, term]
            })
            .catch((err) => {
                console.error(err)
            })
    }
}

module.exports = TXT