
const searchISBN = (ISBN, Title, term) => {
    const prevSales = require(`../../../src/stores/${global.store}/sales/${term}.json`)

    let result = {
        "ISBN": ISBN,
        "Title": Title,
        "Semesters": {},
        "totalSales": 0,
        "totalEnrl": 0,
        "avgSE": 0
    }

    if (prevSales[ISBN]) {
        result = {
            "ISBN": ISBN,
            ...prevSales[ISBN]
        }
    }

    return result
}

module.exports = searchISBN