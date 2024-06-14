import { useState } from "react"
import { Link } from "react-router-dom"
import { BDTable } from "./BDTable"

export const BuyingD = () => {
    const [bdPrefer, setBDPrefer] = useState("all")
    const [fileInfo, setFileInfo] = useState({
        path: "",
        extension: ""
    })
    const [BD, setBD] = useState({})

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

    const handleFileUpload = () => {
        if (["txt", "xlsb"].includes(fileInfo.extension)) {
            window.ipcRenderer.send('bd-file', { file: fileInfo, bdPrefer: bdPrefer })
        } else {
            window.ipcRenderer.send('error', { text: "Upload needs to be .txt or .xlsb file" })
        }
    }

    window.ipcRenderer.on('new-bd', (event, { newBD }) => {
        setBD({ ...newBD })
    })

    return (
        <div className="container-fluid bg-dark vh-100 mx-0 text-white">
            <div className="row">
                <div className="col mt-3 mb-1">
                    <Link to="/" className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg>
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" id="All" value="all" checked={bdPrefer === "all"} onChange={handleBDPreferChange} />
                        <label className="form-check-label" htmlFor="All">All</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" id="No-Text" value="changes" checked={bdPrefer === "changes"} onChange={handleBDPreferChange} />
                        <label className="form-check-label" htmlFor="No-Text">Changes</label>
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
        </div>
    )
}