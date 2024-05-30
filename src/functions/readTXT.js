const fs = require('fs');

const readTXT = (filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        const lines = data.split('\n');

        // Find the indices of all instances of "Page: 1"
        const pageIndices = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('Page: 1')) {
                pageIndices.push(i);
            }
        }

        // Third instance of "Page: 1" is where real data begins
        const thirdPageOne = pageIndices[2];

        const realData = lines.slice(thirdPageOne + 1);

        // Remove lines that contain date, time, "Act", "Est", "End"
        const pattern = /\d{1,2}\/\d{1,2}\/\d{2}|\d{2}:\d{2}:\d{2}|Act|Est|End/
        const noPattern = realData.filter(line => !pattern.test(line));
        // Filter lines that do not consist entirely of dashes
        // TODO: Figure out regex pattern of dashes
        const noDashes = noPattern.filter(line => line.trim() !== '------------------------------------------------------------------------------------------------------------------------------------');

        const joinedData = {};

        noDashes.forEach(line => {
            // Skip empty lines
            if (!line.trim()) {
                return;
            }

            // Split by fixed column widths
            const ISBN = (line.substring(42, 61).trim()).replace(/-/g, '');
            const Title = line.substring(0, 42).trim();
            const Enrl = parseInt(line.substring(62, 67).trim(), 10);
            const Sales = parseInt(line.substring(67).trim(), 10);

            // Skip ISBNs starting with '822' or titles starting with 'EBK'
            if (ISBN.startsWith('822') || Title.startsWith('EBK')) {
                return;
            }

            // If ISBN is not already in consolidated data, add it
            if (!joinedData[ISBN]) {
                joinedData[ISBN] = { Title, Enrl, Sales };
            }
        });

        //TODO: Find better way to delete header lines
        delete joinedData['ISBN              E']

        return joinedData
    })
}

module.exports = readTXT