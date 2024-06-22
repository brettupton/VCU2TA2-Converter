const fs = require('fs')
const path = require('path')
const fetchBookData = require("../dev/fetchBookData")
const convertTitleCase = require('../dev/convertTitleCase')

class TXT {
    cleanFile = (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf-8', (err, data) => {
                if (err) {
                    reject(err)
                }

                const lines = data.split("\n")
                let header

                // This is always true no matter the manager report
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

                // Find dash line - remove it, header and extraneous TA2 data
                for (let i = 0; i < finalData.length; i++) {
                    if ((/^-+$/).test(finalData[i].trim())) {
                        header = finalData[i - 1]
                        const startIndex = Math.max(0, i - 5)
                        const endIndex = i + 1
                        finalData.splice(startIndex, endIndex - startIndex)
                        // Adjust the loop index to continue checking after the removed section
                        i = startIndex - 1
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

    readAllSales = async (path, event) => {
        const BATCH_SIZE = 200
        const allSales = {}

        return this.cleanFile(path)
            .then(async ([term, headerIndices, finalData]) => {
                // Loop through and consolidate data per ISBN
                finalData.forEach(line => {
                    const [
                        Term,
                        Course,
                        Section,
                        rawProfessor,
                        rawISBN,
                        rawEstEnrl,
                        rawActEnrl,
                        rawEstSales,
                        rawReorders,
                        rawActSales
                    ] = headerIndices.map((start, i) => line.substring(start, headerIndices[i + 1]).trim())

                    const Professor = convertTitleCase(rawProfessor)
                    const ISBN = rawISBN.replace(/-/g, '')
                    const EstEnrl = parseInt(rawEstEnrl) || 0
                    const ActEnrl = parseInt(rawActEnrl) || 0
                    const EstSales = parseInt(rawEstSales) || 0
                    const Reorders = parseInt(rawReorders) || 0
                    const ActSales = parseInt(rawActSales) || 0

                    if (ISBN.startsWith('822') || ISBN.includes("** E BOOK **") || ISBN.includes("None")) {
                        return
                    }

                    // TODO: Sort Semesters and Courses

                    if (allSales[ISBN]) {
                        if (!allSales[ISBN]["semesters"][Term]) {
                            if (Course.includes('SPEC') || Course.includes('CANC')) {
                                allSales[ISBN].total_est_enrl += 0
                                allSales[ISBN].total_act_enrl += 0
                                allSales[ISBN].total_est_sales += 0
                                allSales[ISBN].total_act_sales += 0
                                allSales[ISBN].total_reorders += 0
                            } else {
                                allSales[ISBN].total_est_enrl += EstEnrl
                                allSales[ISBN].total_act_enrl += ActEnrl
                                allSales[ISBN].total_est_sales += EstSales
                                allSales[ISBN].total_act_sales += ActSales
                                allSales[ISBN].total_reorders += Reorders
                            }

                            allSales[ISBN]["semesters"][Term] = {
                                courses: [{ course: `${Course} ${Section}`, professor: Professor }],
                                est_enrl: EstEnrl,
                                act_enrl: ActEnrl,
                                est_sales: EstSales,
                                act_sales: ActSales,
                                reorders: Reorders
                            }
                        } else {
                            allSales[ISBN]["semesters"][Term].courses.push({ course: `${Course} ${Section}`, professor: Professor })
                        }
                    } else {
                        if (Course.includes('SPEC') || Course.includes('CANC')) {
                            allSales[ISBN] = {
                                semesters: {
                                    [Term]: {
                                        courses: [{ course: `${Course} ${Section}`, professor: Professor }],
                                        est_enrl: EstEnrl,
                                        act_enrl: ActEnrl,
                                        est_sales: EstSales,
                                        act_sales: ActSales,
                                        reorders: Reorders
                                    }
                                },
                                total_est_enrl: 0,
                                total_act_enrl: 0,
                                total_est_sales: 0,
                                total_act_sales: 0,
                                total_reorders: 0
                            }
                        } else {
                            allSales[ISBN] = {
                                semesters: {
                                    [Term]: {
                                        courses: [{ course: `${Course} ${Section}`, professor: Professor }],
                                        est_enrl: EstEnrl,
                                        act_enrl: ActEnrl,
                                        est_sales: EstSales,
                                        act_sales: ActSales,
                                        reorders: Reorders
                                    }
                                },
                                total_est_enrl: EstEnrl,
                                total_act_enrl: ActEnrl,
                                total_est_sales: EstSales,
                                total_act_sales: ActSales,
                                total_reorders: Reorders
                            }
                        }
                    }
                })

                const allISBNs = Object.keys(allSales)

                // Batch through all ISBNs to not overload API, send progress to render process
                const totalBatches = Math.ceil(allISBNs.length / BATCH_SIZE)

                for (let i = 0; i < totalBatches; i++) {
                    const start = i * BATCH_SIZE
                    const end = start + BATCH_SIZE
                    const batchPromises = allISBNs.slice(start, end).map(async (ISBN) => {
                        const bookData = await fetchBookData(ISBN, allSales[ISBN])
                        allSales[ISBN] = { ...bookData }
                    })

                    await Promise.all(batchPromises)
                    const progress = (((i + 1) / totalBatches) * 100).toFixed(0)

                    event.sender.send('progress-update', { progress: progress })
                }
                event.sender.send('progress-update', { progress: 100 })
                return allSales
            })
            .catch((err) => {
                console.error(err)
            })
    }

    readBD = async (TXTPath) => {
        return this.cleanFile(TXTPath)
            .then(([term, headerIndices, finalData]) => {
                const prevAllSales = require(`../stores/${global.store}/sales/${term}.json`)
                const BD = {}

                finalData.forEach(line => {
                    const [Title,
                        rawISBN,
                        rawEnrollment,
                        rawDecision] = headerIndices.map((start, i) => line.substring(start, headerIndices[i + 1]).trim())

                    const ISBN = rawISBN.replace(/-/g, '')
                    const Enrollment = parseInt(rawEnrollment)
                    const Decision = parseInt(rawDecision)
                    let avgSE = 0

                    if (ISBN.startsWith('822') || ISBN === 'None' || Title.startsWith('EBK')) {
                        return
                    }

                    if (!BD[ISBN]) {
                        if (prevAllSales[ISBN]) {
                            const prevSemester = Object.keys(prevAllSales[ISBN]["semesters"]).slice(-1)[0]
                            const prevSemesterEnrl = prevAllSales[ISBN]["semesters"][prevSemester]["act_enrl"]
                            const prevSemesterSales = prevAllSales[ISBN]["semesters"][prevSemester]["act_sales"]

                            if (prevAllSales[ISBN].total_act_enrl - prevSemesterEnrl === 0) {
                                // Only one semester of previous data, skip weighted average calculation
                                avgSE = prevAllSales[ISBN].total_act_sales / prevAllSales[ISBN].total_act_enrl || 0
                            } else {
                                // Subtract previous sales from total and get new average
                                const newAvgSE = (prevAllSales[ISBN].total_act_sales - prevSemesterSales) / (prevAllSales[ISBN].total_act_enrl - prevSemesterEnrl) || 0
                                const prevTermAvgSE = prevSemesterSales / prevSemesterEnrl || 0

                                const alpha = 0.5
                                // Exponential Smoothing
                                avgSE = (1 - alpha) * newAvgSE + alpha * prevTermAvgSE
                            }
                        } else {
                            // No past sales data, divide enrollment by 1/5
                            avgSE = 0.2
                        }

                        const newCalc = avgSE * Enrollment

                        BD[ISBN] = {
                            Title: Title,
                            Enrollment: Enrollment,
                            Decision: Decision,
                            CalcBD: term === 'A' ? Math.max(1, newCalc) : newCalc,
                            Diff: Math.abs(Decision - newCalc)
                        }
                    }
                })

                // Compare newly created BD with most recent BD, if it exists
                let latestDate = ""
                const changeBD = {}
                const bdPath = path.join(__dirname, '../', 'stores', `${global.store}`, 'bd', `${term}`)

                if (fs.existsSync(bdPath)) {
                    // Get all files in directory and sort to find most recent
                    const bdFiles = fs.readdirSync(bdPath).map(file => ({
                        name: file,
                        date: new Date(file.split(".")[0])
                    }))

                    if (Object.keys(bdFiles).length > 0) {
                        bdFiles.sort(((a, b) => b.date - a.date))
                        latestDate = bdFiles[0].name

                        const prevBD = require(path.join(bdPath, latestDate))

                        for (const ISBN in BD) {
                            const newBook = BD[ISBN]
                            const oldBook = prevBD[ISBN]

                            // Check if old entry exists and if Enrollment or CalcBD have changed
                            if (!oldBook ||
                                newBook.Enrollment !== oldBook.Enrollment ||
                                newBook.CalcBD !== oldBook.CalcBD) {
                                changeBD[ISBN] = newBook
                            }
                        }
                    }
                }

                return [BD, changeBD, term, latestDate]
            })
            .catch((err) => {
                console.error(err)
            })
    }
}

module.exports = TXT