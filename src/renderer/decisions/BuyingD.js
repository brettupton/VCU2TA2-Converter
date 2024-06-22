import { useEffect, useState } from "react"
import { BDTable } from "./BDTable"
import { VertSalesTable } from "./VertSalesTable"
import { BackArrow } from "../BackArrow"

export const BuyingD = () => {
    const [bdChoice, setBDChoice] = useState("all")
    const [bdDisplay, setBDDisplay] = useState("all")
    const [term, setTerm] = useState("")
    const [latestDate, setLatestDate] = useState()
    const [calcEnrollment, setCalcEnrollment] = useState(0)
    const [BDGot, setBDGot] = useState(false)
    const [fileInfo, setFileInfo] = useState({
        path: "",
        extension: ""
    })
    const [BD, setBD] = useState({})
    const [changeBD, setChangeBD] = useState({})
    const [currBook, setCurrBook] = useState({
        ISBN: 0,
        Title: ""
    })

    useEffect(() => {
        if (Object.keys(BD).length > 0) {
            setBDGot(true)
            window.ipcRenderer.send('max-window')
        }
    }, [BD])

    useEffect(() => {

    }, [bdDisplay])

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

    const handleBDChoiceChange = (choice) => {
        setBDChoice(choice)
    }

    const handleBDDisplayChange = (e) => {
        const { value } = e.currentTarget

        setBDDisplay(value)
    }

    const handleEnrollmentChange = (e) => {
        const { currentTarget } = e

        setCalcEnrollment(currentTarget.value)
    }

    const handleISBNClick = (ISBN, Title) => {
        window.ipcRenderer.send('search-isbn', { ISBN: ISBN, Title: Title, term: term })
    }

    const handleFileUpload = () => {
        if (["txt", "xlsb"].includes(fileInfo.extension)) {
            window.ipcRenderer.send('bd-file', { file: fileInfo })
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
        window.ipcRenderer.send('search-isbn', { ISBN: firstISBN, term: data.term })
        setBD({ ...data.BD })
        setChangeBD({ ...data.changeBD })
        setTerm(data.term)
        setLatestDate(data.latestDate)
    })

    window.ipcRenderer.on('search-result', (event, data) => {
        setCurrBook({ ...data.result })
    })

    return (
        <div className="container-fluid bg-dark vh-100 mx-0 text-white">
            <BackArrow dataGot={BDGot} />
            {BDGot ?
                <>
                    <div className="row justify-content-between">
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" id="BDAll" checked={bdChoice === "all"} onClick={() => handleBDChoiceChange('all')} />
                                <label className="form-check-label" htmlFor="BDAll">All</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" id="changes" checked={bdChoice === "changes"} onClick={() => handleBDChoiceChange('changes')}
                                    disabled={Object.keys(changeBD).length === 0} />
                                <label className="form-check-label" htmlFor="changes">Changes</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" id="all" value="all" checked={bdDisplay === "all"} onClick={handleBDDisplayChange} />
                                <label className="form-check-label" htmlFor="all">All</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" id="exact" value="exact" checked={bdDisplay === "exact"} onClick={handleBDDisplayChange} />
                                <label className="form-check-label" htmlFor="exact">&#61;0</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" id="close" value="close" checked={bdDisplay === "close"} onClick={handleBDDisplayChange} />
                                <label className="form-check-label" htmlFor="close">&lt;5</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" id="far" value="far" checked={bdDisplay === "far"} onClick={handleBDDisplayChange} />
                                <label className="form-check-label" htmlFor="far">&#8805;5</label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8">
                            {bdChoice === 'all' ?
                                <BDTable BDData={BD} sortAlpha={sortAlpha} bdDisplay={bdDisplay} latestDate={latestDate} handleISBNClick={handleISBNClick} />
                                :
                                <BDTable BDData={changeBD} sortAlpha={sortAlpha} bdDisplay={bdDisplay} latestDate={latestDate} handleISBNClick={handleISBNClick} />
                            }
                        </div>
                        {currBook.ISBN !== 0 &&
                            <div className="col-4 mt-n5">
                                <VertSalesTable currBook={currBook} term={term} handleEnrollmentChange={handleEnrollmentChange} calcEnrollment={calcEnrollment} />
                            </div>
                        }
                    </div>
                </>
                :
                <>
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