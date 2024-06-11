const Fall = require("../../Ωsales/Fall")
const { convertISBN10to13 } = require("../convertISBN")

const searchSales = (parameter, searchInfo) => {
    // TODO: Results array to have multiple results based on title search
    // ISBN search will only return one result so no need for array right now
    let searchTerm

    switch (parameter) {
        case "ISBN":
            const noDash = searchInfo["ISBN"].toString().replace(/-/g, '')

            if (noDash.length < 13) {
                searchTerm = convertISBN10to13(noDash)
            } else {
                searchTerm = noDash
            }
            break
        case "Title":
            searchTerm = searchInfo["Title"].toLowerCase();
            break
        default:
            break
    }

    let results = {
        [searchTerm]: {
            "Title": "No Result Found",
            "Semesters": {},
            "totalSales": 0,
            "totalEnrollment": 0,
            "averageSalesPerEnrollment": 0
        }
    }
    // TODO: User change term
    Object.keys(Fall).forEach(isbn => {
        const currBook = Fall[isbn];

        if (isbn === searchTerm) {
            results = { [isbn]: { ...currBook } };
            return
        }

        // if (currBook.Title.toLowerCase().includes(searchTerm)) {
        //     results.push({ [isbn]: { ...currBook } });
        //     return;
        // }
    })

    return results
}

module.exports = searchSales