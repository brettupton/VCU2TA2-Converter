const axios = require('axios')
const { convertISBN13to10 } = require('../convertISBN')
const convertTitleCase = require('./convertTitleCase')

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const fetchBookData = async (isbn13, salesData, retryCount = 0) => {
    const RETRY_LIMIT = 3
    const RETRY_DELAY = 1000

    try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${isbn13}&fields=key,title,author_name,editions,publish_date,number_of_pages_median,publisher`)
        const data = response.data

        if (data.numFound > 0) {
            const book = data.docs[0]
            return {
                ...salesData,
                isbn_10: convertISBN13to10(isbn13),
                title: convertTitleCase(book.title),
                author: book.author_name ? book.author_name[0] : 'N/A',
                publisher: book.editions ? book.editions.docs[0].publisher ? book.editions.docs[0].publisher[0] : 'N/A' : 'N/A',
                publish_date: book.editions ? book.editions.docs[0].publish_date ? book.editions.docs[0].publish_date[0] : 'N/A' : 'N/A',
                number_of_pages: book.number_of_pages_median || 'N/A'
            }
        } else {
            return {
                ...salesData,
                isbn_10: convertISBN13to10(isbn13),
                title: 'N/A',
                author: 'N/A',
                publisher: 'N/A',
                publish_date: 'N/A',
                number_of_pages: 'N/A'
            }
        }
    } catch (error) {
        if (error.response) {
        }
        if (retryCount < RETRY_LIMIT) {
            await delay(RETRY_DELAY)
            return fetchBookData(isbn13, salesData, retryCount + 1)
        } else {
            console.error(`Limit reached for ISBN ${isbn13},  Server status error: ${error.response.status}`)
            return {
                ...salesData,
                isbn_10: convertISBN13to10(isbn13),
                title: 'N/A',
                author: 'N/A',
                publisher: 'N/A',
                publish_date: 'N/A',
                number_of_pages: 'N/A'
            }
        }
    }
}

module.exports = fetchBookData
