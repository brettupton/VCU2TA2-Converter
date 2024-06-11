const XLSX = require('xlsx')
const Fall = require('../../Ωsales/Fall')
const Summer = require('../../Ωsales/Summer.json')

const BDFromXLSB = (path) => {
    const workbook = XLSX.readFile(path)
    const sheetName = workbook.SheetNames[0];
    const headers = [
        'Store', 'Unit', 'Term', 'Dept', 'Course', 'Prof', 'Section', 'Extra', 'Loc', 'Author',
        'Title', 'Publisher', 'ISBN', 'Book #', 'Rec', 'FD', 'Grp', 'Book Type',
        'Cvr', 'Ed Sts', 'New Only', 'Price', 'Yuzu', 'Rent', 'Cap',
        'Enr', 'BD/Cap', 'BD/Enr', 'Est Sales', 'Decision', 'Reason'
    ]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: headers, defval: '' })

    //Remove first four rows, contains unnecessary data
    jsonData.splice(0, 3);

    const buyingDecision = {};

    jsonData.forEach(item => {
        const { Store, ISBN, Title, Enr, Decision } = item;

        if (Store === 620) {
            if (!buyingDecision[ISBN]) {
                buyingDecision[ISBN] = {
                    Title,
                    Enrollment: Enr,
                    Decision: Decision
                };
            } else {
                buyingDecision[ISBN].Enrollment += Enr;
                buyingDecision[ISBN].Decision += Decision;
            }
        }
    });

    return buyingDecision
}

const addNewBD = (term, currBD) => {
    const newBD = {}

    switch (term) {
        case "A":
            for (const ISBN in currBD) {
                const pastSales = Summer[ISBN]
                const currBook = currBD[ISBN]
                // Always order at least one copy per book for Summer
                const newCalc = Math.max(1, pastSales ? Math.ceil(currBook.Enrollment * pastSales.averageSalesPerEnrollment) : Math.ceil(currBook.Enrollment / 5))

                newBD[ISBN] = {
                    Title: currBook.Title,
                    Enrollment: currBook.Enrollment,
                    Decision: currBook.Decision,
                    CalcBD: newCalc,
                    Diff: Math.abs(currBook.Decision - newCalc)
                }
            }

            return [newBD, Summer]

        case "F":
            for (const ISBN in currBD) {
                const pastSales = Fall[ISBN]
                const currBook = currBD[ISBN]
                const newCalc = pastSales ? Math.ceil(currBook.Enrollment * pastSales.averageSalesPerEnrollment) : Math.ceil(currBook.Enrollment / 5)

                newBD[ISBN] = {
                    Title: currBook.Title,
                    Enrollment: currBook.Enrollment,
                    Decision: currBook.Decision,
                    CalcBD: newCalc,
                    Diff: Math.abs(currBook.Decision - newCalc)
                }
            }

            return [newBD, Fall]

        default:
            break
    }
}

module.exports = { BDFromXLSB, addNewBD } 