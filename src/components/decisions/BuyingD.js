import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import BDTable from "./BDTable"
import VertSalesTable from "./VertSalesTable"
import HoriSalesTable from "./HoriSalesTable"

export const BuyingD = () => {
    const [fileInfo, setFileInfo] = useState({
        path: "",
        extension: ""
    })
    const [newBD, setNewBD] = useState({})
    const [salesData, setSalesData] = useState({})
    const [currBook, setCurrBook] = useState({
        ISBN: "9780385474542",
        Title: "THINGS FALL APART"
    })
    const [searchISBN, setSearchISBN] = useState("")
    const [searchResult, setSearchResult] = useState({})
    const [enrollment, setEnrollment] = useState(0)
    const [BDGot, setBDGot] = useState(false)
    const [searchGot, setSearchGot] = useState(false)

    useEffect(() => {
        if (Object.keys(newBD).length > 0) {
            window.ipcRenderer.send('max-window')
            setBDGot(true)

            const ISBN = Object.keys(newBD)[0]
            setCurrBook({
                ISBN: ISBN,
                Title: newBD[ISBN].Title
            })
        }
    }, [newBD])

    useEffect(() => {
        if (Object.keys(searchResult).length > 0) {
            window.ipcRenderer.send('max-window')
            setSearchGot(true)
        }
    }, [searchResult])

    const handleFileChange = (e) => {
        const { currentTarget } = e

        if (currentTarget.files) {
            const file = currentTarget.files[0]

            setFileInfo({
                path: file.path,
                extension: file.name.split('.').pop().toLowerCase()
            })
        }
    }

    const handleFileUpload = () => {
        if (["txt", "xlsb"].includes(fileInfo.extension)) {
            window.ipcRenderer.send('bd-file', fileInfo)
        } else {
            console.log("Not a txt or xlsb file")
        }
    }

    const handleISBNClick = (ISBN) => {
        setCurrBook({
            ISBN: ISBN,
            Title: salesData[ISBN]?.Title ? salesData[ISBN].Title : newBD[ISBN].Title
        })
    }

    const handleISBNSearchChange = (e) => {
        const { currentTarget } = e

        setSearchISBN(currentTarget.value)
    }

    const handleISBNSearch = () => {
        setSearchGot(false)
        setBDGot(false)
        if (/^[\d\-]+$/.test(searchISBN)) {
            window.ipcRenderer.send('search-sales', { parameter: "ISBN", searchInfo: { ISBN: searchISBN, Title: "" } })
        } else {
            console.log("Not an ISBN")
        }
    }

    const handleEnrollmentChange = (e) => {
        const { currentTarget } = e

        setEnrollment(currentTarget.value)
    }

    const sortAlpha = () => {
        const objectEntries = Object.entries(newBD);

        objectEntries.sort((a, b) => a[1].Title.localeCompare(b[1].Title));

        const sortedObject = {};
        objectEntries.forEach(([isbn, item]) => {
            sortedObject[isbn] = item;
        });

        setNewBD({ ...sortedObject })
    }

    window.ipcRenderer.on('bd-data', (event, data) => {
        setNewBD({ ...data.BD })
        setSalesData({ ...data.sales })
    })

    window.ipcRenderer.on('search-result', (event, data) => {
        setSearchResult({ ...data.result })
    })

    return (
        <div className="container-fluid bg-dark vh-100 mx-0 text-white">
            <div className="row">
                <div className="col mt-3 mb-3">
                    {BDGot || searchGot ?
                        <Link className="text-white" onClick={() => window.location.reload()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                            </svg>
                        </Link>
                        :
                        <Link to="/" className="text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                            </svg>
                        </Link>
                    }
                </div>
            </div>
            {BDGot ?
                <>
                    <div className="row">
                        <div className="col-8">
                            <BDTable BDData={newBD} sortAlpha={sortAlpha} handleISBNClick={handleISBNClick} />
                        </div>
                        <div className="col-4">
                            <div className="row">
                                <div className="col-lg-6 col-sm-8">
                                    <div className="input-group">
                                        <input type="text" className="form-control" id="inputGroupText" aria-describedby="inputGroupText" aria-label="Search" placeholder="ISBN Search"
                                            onChange={handleISBNSearchChange} maxLength={20} />
                                        <button className="btn btn-outline-secondary" type="button" id="inputGroupText" onClick={handleISBNSearch}>Search</button>
                                    </div>
                                </div>
                            </div>
                            <VertSalesTable salesData={salesData} currBook={currBook} />
                        </div>
                    </div>
                </>
                :
                searchGot ?
                    <>
                        <div className="row">
                            <div className="col-lg-3 col-sm-8">
                                <div className="input-group">
                                    <input type="text" className="form-control" id="inputGroupText" aria-describedby="inputGroupText" aria-label="Search" placeholder="ISBN Search"
                                        onChange={handleISBNSearchChange} maxLength={20} />
                                    <button className="btn btn-outline-secondary" type="button" id="inputGroupText" onClick={handleISBNSearch}>Search</button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <HoriSalesTable searchResult={searchResult} handleEnrollmentChange={handleEnrollmentChange} enrollment={enrollment} />
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="row">
                            <div className="col-lg-3 col-sm-8">
                                <div className="input-group">
                                    <input type="file" className="form-control" id="inputGroupFile" aria-describedby="inputGroupFile" aria-label="Upload" onChange={handleFileChange} />
                                    <button className="btn btn-outline-secondary" type="button" id="inputGroupFile" onClick={handleFileUpload}>Submit</button>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-1">
                            <div className="col">
                                <small>Format: Title, ISBN, Enrl, Sales</small>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-lg-3 col-sm-8">
                                <div className="input-group">
                                    <input type="text" className="form-control" id="inputGroupText" aria-describedby="inputGroupText" aria-label="Search" placeholder="ISBN Search"
                                        onChange={handleISBNSearchChange} maxLength={20} />
                                    <button className="btn btn-outline-secondary" type="button" id="inputGroupText" onClick={handleISBNSearch}>Search</button>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}