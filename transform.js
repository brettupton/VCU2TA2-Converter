const fs = require('fs');

// Read the input JSON file
fs.readFile('csvjson.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading input file:', err);
        return;
    }

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Create an object to store the transformed data
    const transformedData = {};

    // Iterate through the input data to populate the transformed structure
    jsonData.forEach(entry => {
        const isbn = String(entry.ISBN);
        const term = entry.Trm;
        const courseInfo = `${entry.Dept} ${entry.Course} ${entry.Section.toString().padStart(3, '0')}`;

        if (!transformedData[isbn]) {
            transformedData[isbn] = {
                Title: entry.Title,
                Semesters: {}
            };
        }

        if (!transformedData[isbn].Semesters[term]) {
            transformedData[isbn].Semesters[term] = {
                Courses: [],
                Enrollment: 0,
                Sales: 0
            };
        }

        transformedData[isbn].Semesters[term].Courses.push(courseInfo);
        // Use the latest entry for enrollment and sales
        transformedData[isbn].Semesters[term].Enrollment = entry.Enrl;
        transformedData[isbn].Semesters[term].Sales = entry.Sales;
    });

    // Convert the transformed data to JSON string and write to a new JSON file
    fs.writeFile('output.json', JSON.stringify(transformedData, null, 4), 'utf8', err => {
        if (err) {
            console.error('Error writing output file:', err);
            return;
        }

        console.log('Transformation complete. Output saved to "output.json".');
    });
});
