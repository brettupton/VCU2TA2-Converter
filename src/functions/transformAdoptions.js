const xlsx = require('xlsx');
const fs = require('fs')

const workbook = xlsx.readFile("");

const checkAndTruncate = (value) => {
    if (typeof value === 'string' && value.length > 32767) {
        console.log(`Truncating value: ${value.substring(0, 50)}... (length: ${value.length})`);
        return value.substring(0, 32767);
    }
    return value;
};

const processSheet = (sheetName) => {
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return sheet.map(row => {
        Object.keys(row).forEach(key => {
            row[key] = checkAndTruncate(row[key]);
        });
        return { ...row, term: sheetName };
    });
};

const sheetF22 = processSheet('F22');
const sheetF23 = processSheet('F23');

const combinedData = [...sheetF22, ...sheetF23];

const structuredData = {};

combinedData.forEach(row => {
    const { Trm, Department, Course, Section, Professor, Title, ISBN } = row;

    if (!Department || !Course || !Section) {
        console.warn('Skipping row due to missing key fields:', row);
        return;
    }

    const courseKey = `${Department} ${Course} ${Section}`;

    if (!structuredData[courseKey]) {
        structuredData[courseKey] = {};
    }

    if (!structuredData[courseKey][Trm]) {
        structuredData[courseKey][Trm] = {
            Professor: Professor || 'TBA',
            Adoptions: []
        };
    }

    structuredData[courseKey][Trm].Adoptions.push({
        Title: Title || '',
        ISBN: Title === 'No Text Required' ? 'No Text Required' : ISBN || ''
    });
});

fs.writeFileSync('./src/Ωcourses/F22F23.json', JSON.stringify(structuredData), (err) => console.error(err))