import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import BDTable from "./BDTable"
import SalesTable from "./SalesTable";

export const BuyingD = () => {
    const [salesData, setSalesData] = useState({});
    const [buyingData, setBuyingData] = useState({});
    // TODO: Refactor how userInput works and sends filepath name
    const [filePath, setFilePath] = useState("");
    const [showSales, setShowSales] = useState(false);
    const [gotBuyingData, setGotBuyingData] = useState(false);

    // Create reference to file input element so we can reset it after upload
    const inputRef = useRef(null);

    // Maximize window on render, table looks better
    // useEffect(() => {
    //     window.ipcRenderer.send('max-window')
    // }, [])

    const handleTermChoice = (e) => {
        const { value } = e.target;

        switch (value) {
            case "Fall":
                // TODO: Add request to main process for Fall data
                break
            default:
                break
        }
    }

    const handleShowSales = () => {
        setShowSales(!showSales)
    }

    const handleFileChange = (e) => {
        if (e.target.files) {
            const file = e.target.files[0]
            setFilePath(file.path)
        }
    }

    // Send uploaded file to main process
    const handleUpload = () => {
        setGotBuyingData(false);
        window.ipcRenderer.send('BDExcel', filePath)
        inputRef.current.value = null
        setFilePath("")
    }

    // Await data from main process after sending user uploaded file
    window.ipcRenderer.on('ExcelData', (event, data) => {
        setBuyingData({ ...data.data })
        setGotBuyingData(true);
    })

    return (
        <div className="container-fluid bg-dark vh-100 mx-0 text-white">
            <div className="row">
                <div className="col mt-3 mb-3">
                    <Link to="/" className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg>
                    </Link>
                </div>
            </div>
            <div className="row justify-content-start">
                <div className="col-lg-1 col-2 mb-5">
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Term
                        </button>
                        <ul className="dropdown-menu">
                            <li><button className="dropdown-item" onClick={handleTermChoice} value="Fall">Fall</button></li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-1 col-3 mb-5">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="salesCheck" checked={showSales} onChange={handleShowSales} disabled />
                        <label className="form-check-label" htmlFor="salesCheck">
                            Show Sales
                        </label>
                    </div>
                </div>
            </div>
            {showSales &&
                <>
                    <div className="row justify-content-end mb-1">
                        <div className="col-2">
                            <input type="text" className="form-control" placeholder="Search" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <SalesTable salesData={salesData} />
                        </div>
                    </div>
                </>
            }
            {!showSales &&
                <div className="row">
                    <div className="col-lg-3">
                        <div className="input-group">
                            <input ref={inputRef} type="file" className="form-control" id="inputGroup" aria-describedby="inputGroupFile" aria-label="Upload" onChange={handleFileChange} accept=".xlsx, .xlsb" />
                            <button className="btn btn-outline-secondary" type="button" id="inputGroupFile" onClick={handleUpload}>Upload</button>
                        </div>
                    </div>
                </div>
            }
            {gotBuyingData &&
                <BDTable BDData={buyingData} />
            }
        </div>
    )
}