const fs = require('fs');

fs.readFile('csvjson.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading input file:', err);
        return;
    }

    const jsonData = JSON.parse(data);

    const transformedData = {};

    jsonData.forEach(entry => {
        const isbn = entry.ISBN;
        const term = entry.Trm;
        const courseInfo = `${entry.Dept} ${(entry.Course + "").padStart(3, "0")} ${(entry.Section + "").padStart(3, "0")}`;

        if (!transformedData[isbn]) {
            transformedData[isbn] = {
                ISBN10: isbn,
                Title: entry.Title,
                Semesters: {},
                totalSales: 0,
                totalEnrollment: 0,
                averageSalesPerEnrollment: 0
            };
        }

        if (!transformedData[isbn].Semesters[term]) {
            transformedData[isbn].Semesters[term] = {
                Courses: [],
                Enrollment: 0,
                Sales: 0,
            };

            // Update total sales and enrollment only once per term
            transformedData[isbn].totalSales += entry.Sales;
            transformedData[isbn].totalEnrollment += entry.Enrl;
        }

        transformedData[isbn].Semesters[term].Courses.push(courseInfo);
        transformedData[isbn].Semesters[term].Enrollment = entry.Enrl;
        transformedData[isbn].Semesters[term].Sales = entry.Sales;

        // Update the running average sales per enrollment for the ISBN
        const totalSales = transformedData[isbn].totalSales;
        const totalEnrollment = transformedData[isbn].totalEnrollment;
        transformedData[isbn].averageSalesPerEnrollment = totalEnrollment ? (totalSales / totalEnrollment).toFixed(4) : (0).toFixed(4);
    });

    fs.writeFile('output.json', JSON.stringify(transformedData, null, 4), 'utf8', err => {
        if (err) {
            console.error('Error writing output file:', err);
            return;
        }

        console.log('Transformation complete. Output saved to "output.json".');
    });
});
