const fs = require('fs')
const axios = require('axios')
const path = require('path')
const cliProgress = require('cli-progress')
const { convertISBN13to10 } = require('../convertISBN')
const isbns = require(path.join(__dirname, '../..', 'stores', '620', 'sales', 'F.json'))

const isbnArray = Object.keys(isbns)
// length: 7753

const BATCH_SIZE = 100
const RETRY_LIMIT = 3
const RETRY_DELAY = 1000

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const fetchBookData = async (isbn13, retryCount = 0) => {
    try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${isbn13}&fields=key,title,author_name,editions,publish_date,number_of_pages_median,publisher`)
        const data = response.data

        if (data.docs && data.docs.length > 0) {
            const book = data.docs[0]
            return {
                isbn_10: convertISBN13to10(isbn13),
                title: book.title,
                author: book.author_name ? book.author_name[0] : 'N/A',
                publisher: book.editions ? book.editions.docs[0].publisher ? book.editions.docs[0].publisher[0] : 'N/A' : 'N/A',
                publish_date: book.editions ? book.editions.docs[0].publish_date ? book.editions.docs[0].publish_date[0] : 'N/A' : 'N/A',
                number_of_pages: book.number_of_pages_median || 'N/A'
            }
        } else {
            return {
                isbn_10: convertISBN13to10(isbn13),
                title: isbns[isbn13].Title,
                author: 'N/A',
                publisher: 'N/A',
                publish_date: 'N/A',
                number_of_pages: 'N/A'
            }
        }
    } catch (error) {
        if (retryCount < RETRY_LIMIT) {
            console.warn(`Failed to fetch data for ISBN-13: ${isbn13}. Retrying... (${retryCount + 1}/${RETRY_LIMIT})`)
            await delay(RETRY_DELAY)
            return fetchBookData(isbn13, retryCount + 1)
        } else {
            return {
                isbn_10: convertISBN13to10(isbn13),
                title: isbns[isbn13].Title,
                author: 'N/A',
                publisher: 'N/A',
                publish_date: 'N/A',
                number_of_pages: 'N/A'
            }
        }
    }
}

// After batch is complete, get results and increment progress, filter out null results
const processBatch = async (isbnBatch, progressBar) => {
    const batchResults = await Promise.all(isbnBatch.map(isbn => fetchBookData(isbn)))
    progressBar.increment(isbnBatch.length)
    return batchResults.filter(data => data !== null)
}

// Batch through requests as to not overload API, keep track of progress through CLI
const processISBNs = async (isbnArray) => {
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
    const result = {}

    const totalBatches = Math.ceil(isbnArray.length / BATCH_SIZE)
    progressBar.start(isbnArray.length, 0)

    for (let i = 0; i < totalBatches; i++) {
        const start = i * BATCH_SIZE
        const end = start + BATCH_SIZE
        const isbnBatch = isbnArray.slice(start, end)
        const batchResults = await processBatch(isbnBatch, progressBar)
        batchResults.forEach((data, index) => {
            const isbn13 = isbnBatch[index]
            result[isbn13] = data
        })
    }

    progressBar.stop()

    fs.writeFileSync('Fall.json', JSON.stringify(result, null, 2))
}

processISBNs(isbnArray).then(() => {
    console.log('Fetch complete, file created.')
}).catch(error => {
    console.error('Error processing ISBNs: ', error)
})
