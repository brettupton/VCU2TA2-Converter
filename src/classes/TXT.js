const fs = require('fs')

class TXT {
    readAllSales = (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf-8', (err, data) => {
                if (err) {
                    reject(err)
                }

                const lines = data.split("\n")
                let header

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

                const salesData = lines.slice(pageOneIndex + 1)

                // Remove dash line, header and extraneous TA2 data
                for (let i = 0; i < salesData.length; i++) {
                    if ((/^-+$/).test(salesData[i].trim())) {
                        header = salesData[i - 1]
                        const patternStartIndex = Math.max(0, i - 5);
                        const patternEndIndex = i + 1;
                        salesData.splice(patternStartIndex, patternEndIndex - patternStartIndex);
                        // Adjust the loop index to continue checking after the removed section
                        i = patternStartIndex - 1;
                    }
                }

                // Calculate where to split lines by looking at header
                const headerTerms = header.trim().split(/\s+/)
                const headerIndices = []

                for (let i = 0; i < headerTerms.length; i++) {
                    const currTerm = headerTerms[i]

                    headerIndices.push(header.indexOf(currTerm))
                }

                const allSales = {}

                salesData.forEach((line) => {
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
                            totalSales: 0,
                            totalEnrl: 0,
                            avgSE: 0
                        }
                    }

                    if (!allSales[ISBN][Term]) {
                        allSales[ISBN][Term] = {
                            Courses: [],
                            Enrl: null,
                            Sales: null
                        }
                    }

                    const existingCourseIndex = allSales[ISBN][Term].Courses.findIndex(course => course.Course === Course)
                    if (existingCourseIndex === -1) {
                        allSales[ISBN][Term].Courses.push({ Course: Course.trim(), Count: 1 })
                    } else {
                        allSales[ISBN][Term].Courses[existingCourseIndex].Count++
                    }

                    if (allSales[ISBN][Term].Enrl === null && allSales[ISBN][Term].Sales === null) {
                        allSales[ISBN].totalSales += Sales;
                        allSales[ISBN].totalEnrl += Enrl;
                        allSales[ISBN][Term].Enrl = Enrl;
                        allSales[ISBN][Term].Sales = Sales;
                    }

                    allSales[ISBN].avgSE = allSales[ISBN].totalEnrl > 0 ? (allSales[ISBN].totalSales / allSales[ISBN].totalEnrl).toFixed(4) : 0
                })
                resolve(allSales)
            })
        })
    }
}

module.exports = TXT