const XLSX = require('xlsx')

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



module.exports = BDFromXLSB