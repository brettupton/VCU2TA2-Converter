import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Fall from "../sales/Fall"
import BDTable from "./BDTable"

export const BuyingD = () => {
    const [termChoice, setTermChoice] = useState("Fall");
    const [salesData, setSalesData] = useState({});
    const [filePath, setFilePath] = useState("")
    const [showSales, setShowSales] = useState(false);

    useEffect(() => {
        changeSalesData(termChoice)
    }, [termChoice])

    const handleTermChoice = (e) => {
        const { value } = e.target;

        setTermChoice(value);
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

    const changeSalesData = (term) => {
        switch (term) {
            case "Fall":
                setSalesData({ ...Fall })
                break
            default:
                break
        }

    }

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
                <div className="col-lg-1 mb-5">
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {termChoice}
                        </button>
                        <ul className="dropdown-menu">
                            <li><button className="dropdown-item" onClick={handleTermChoice} value="Fall">Fall</button></li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-1 mb-5">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="salesCheck" checked={showSales} onChange={handleShowSales} />
                        <label className="form-check-label" htmlFor="salesCheck">
                            Show Sales
                        </label>
                    </div>
                </div>
            </div>
            {showSales &&
                <div className="row">
                    <div className="col">
                        <BDTable salesData={salesData} />
                    </div>
                </div>
            }
            {!showSales &&
                <div className="row">
                    <div className="col-lg-3">
                        <div className="input-group">
                            <input type="file" className="form-control" id="inputGroup" aria-describedby="inputGroupFile" aria-label="Upload" onChange={handleFileChange} />
                            <button class="btn btn-outline-secondary" type="button" id="inputGroupFile">Upload</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}