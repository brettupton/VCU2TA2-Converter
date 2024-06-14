import { useEffect, useState } from "react"
import { BDTable } from "./BDTable"
import { VertSalesTable } from "./VertSalesTable"
import { BackArrow } from "../BackArrow"

export const BuyingD = () => {
    const [bdPrefer, setBDPrefer] = useState("all")
    const [term, setTerm] = useState("")
    const [enrollment, setEnrollment] = useState(0)
    const [fileInfo, setFileInfo] = useState({
        path: "",
        extension: ""
    })
    const [BD, setBD] = useState({})
    const [currBook, setCurrBook] = useState({
        ISBN: 0,
        Title: ""
    })

    useEffect(() => {
        if (Object.keys(BD).length > 0) {
            window.ipcRenderer.send('max-window')
        }
    }, [BD])

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

    const handleBDPreferChange = (e) => {
        const { value } = e.currentTarget

        setBDPrefer(value)
    }

    const handleEnrollmentChange = (e) => {
        const { currentTarget } = e

        setEnrollment(currentTarget.value)
    }

    const handleISBNClick = (ISBN) => {
        window.ipcRenderer.send('search-isbn', { ISBN: ISBN, term: term })
    }

    const handleFileUpload = () => {
        if (["txt", "xlsb"].includes(fileInfo.extension)) {
            window.ipcRenderer.send('bd-file', { file: fileInfo, bdPrefer: bdPrefer })
        } else {
            window.ipcRenderer.send('error', { text: "Upload needs to be .txt or .xlsb file" })
        }
    }

    const sortAlpha = () => {
        const objectEntries = Object.entries(BD)

        objectEntries.sort((a, b) => a[1].Title.localeCompare(b[1].Title))

        const sorted = {}
        objectEntries.forEach(([isbn, item]) => {
            sorted[isbn] = item
        });

        setBD({ ...sorted })
    }

    window.ipcRenderer.on('bd-data', (event, data) => {
        const firstISBN = Object.keys(data.BD)[0]
        setBD({ ...data.BD })
        setTerm(data.term)
        window.ipcRenderer.send('search-isbn', { ISBN: firstISBN, term: data.term })
    })

    window.ipcRenderer.on('search-result', (event, data) => {
        setCurrBook({ ...data.result })
    })

    return (
        <div className="container-fluid bg-dark vh-100 mx-0 text-white">
            <BackArrow dataGot={Object.keys(BD).length > 0} />
            {Object.keys(BD).length > 0 ?
                <>
                    <div className="row">
                        <div className="col-8">
                            <BDTable BDData={BD} sortAlpha={sortAlpha} handleISBNClick={handleISBNClick} />
                        </div>
                        {currBook.ISBN !== 0 &&
                            <div className="col-4">
                                <VertSalesTable currBook={currBook} term={term} handleEnrollmentChange={handleEnrollmentChange} enrollment={enrollment} />
                            </div>
                        }
                    </div>
                </>
                :
                <>
                    <div className="row">
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" id="All" value="all" checked={bdPrefer === "all"} onChange={handleBDPreferChange} />
                                <label className="form-check-label" htmlFor="All">All</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" id="changes" value="changes" checked={bdPrefer === "changes"} onChange={handleBDPreferChange} />
                                <label className="form-check-label" htmlFor="changes">Changes</label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-sm-8">
                            <div className="input-group">
                                <input type="file" className="form-control" id="inputGroupFile" aria-describedby="inputGroupFile" aria-label="Upload" onChange={handleFileChange} accept=".txt, .xlsb" />
                                <button className="btn btn-outline-secondary" type="button" id="inputGroupFile" onClick={handleFileUpload}>Submit</button>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-1">
                        <div className="col">
                            <small>Sequence: Title, ISBN, Enrl, Sales</small>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}