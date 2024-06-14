
const searchISBN = (ISBN, term) => {
    const prevSales = require(`../../../src/stores/${global.store}/sales/${term}.json`)

    let results = {
        [ISBN]: {
            "Title": "No Result Found",
            "Semesters": {},
            "totalSales": 0,
            "totalEnrollment": 0,
            "averageSalesPerEnrollment": 0
        }
    }

    Object.keys(prevSales).forEach(salesISBN => {
        const currBook = prevSales[salesISBN]

        if (salesISBN === ISBN) {
            results = { [ISBN]: { ...currBook } }
            return
        }
    })

    return results
}

module.exports = searchISBN