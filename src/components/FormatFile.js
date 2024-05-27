// 1. Convert XLSX to JSON
// 2. Convert CSV to JSON
// 3. Format XLSXJSON
// 4. Match missing CRNs from CSVJSON

import { useEffect, useState } from "react"
import { useNavigate } from 'react-router'
import { Link } from "react-router-dom"
import { FormatForm } from "./FormatForm"
import { Footer } from "./Footer"

export const FormatFile = () => {
    const [userInput, setUserInput] = useState({
        term: "",
        year: "",
        XLSXFileName: "",
        XLSXFilePath: "",
        CSVFilePath: ""
    })
    const [emptyInput, setEmptyInput] = useState(false)
    const [CSVData, setCSVData] = useState([])
    const [XLSXData, setXLSXData] = useState([])
    const [finalJSON, setFinalJSON] = useState([])
    const [formattedData, setFormattedData] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (CSVData.length > 0) {
            formatNewCSV(XLSXData)
            setCSVData([])
        }
    }, [CSVData])

    useEffect(() => {
        if (formattedData) {
            navigate('/missing', { state: { userInput: userInput, finalJSON: finalJSON } })
        }
    }, [formattedData])

    const handleUserInputChange = (e) => {
        setEmptyInput(false)
        setFormattedData(false)
        const { id, value, files } = e.currentTarget

        if (id === "XLSXFile") {
            const fileName = files[0].name
            const filePath = files[0].path

            setUserInput((prevInput) => ({
                ...prevInput,
                XLSXFileName: fileName,
                XLSXFilePath: filePath,
            }))

        } else if (id === "CSVFile") {
            const filePath = files[0].path

            setUserInput((prevInput) => ({
                ...prevInput,
                CSVFilePath: filePath
            }))
        } else {
            setUserInput((prevInput) => ({ ...prevInput, [id]: value }))
        }
    }

    const readCSV = (userInput) => {
        window.ipcRenderer.send('readCSV', userInput.CSVFilePath)
    }

    window.ipcRenderer.on('csvData', (event, rawCSV) => {
        setCSVData(rawCSV)
    })

    const readXLSX = () => {
        window.ipcRenderer.send('readXLSX', userInput)
    }

    window.ipcRenderer.on('XLSXData', (event, data) => {
        setXLSXData(data.data)
        readCSV(data.userInput)
    })

    const matchCRN = (JSON) => {
        for (let i = 0; i < JSON.length; i++) {
            if (JSON[i]["Offering_Num"] === "000") {
                for (let j = 0; j < CSVData.length; j++) {
                    if (JSON[i]["CRN"] === CSVData[j]["CRN"]) {
                        JSON[i]["Offering_Num"] = padWithZeros(CSVData[j]["Offering_Num"])
                    }
                }
            }
        }
        return JSON
    }

    const formatNewCSV = (JSON) => {
        const intialArray = []
        for (const course of JSON) {
            const newCourse = {
                "Unit": returnCampus(course),
                "Term": userInput.term,
                "Year": userInput.year,
                "Subject": course["SUBJECT"],
                "Course_Num": padWithZeros(course["COURSE NUMBER"]),
                "Offering_Num": padWithZeros(course["OFFERING NUMBER"]),
                "Last_Name": returnProfLastName(course["PRIMARY INSTRUCTOR LAST NAME"]),
                "Max_Enr": course["MAXIMUM ENROLLMENT"].toString(),
                "Est_Enr": course["MAXIMUM ENROLLMENT"].toString(),
                "Act_Enr": course["ACTUAL ENROLLMENT"].toString(),
                "Continuation": "",
                "Evening": "",
                "Extension": "",
                "TN": "",
                "Location": "",
                "Title": course["TITLE"],
                "CRN": course["COURSE REFERENCE NUMBER"].toString()
            }
            intialArray.push(newCourse)
        }
        setFinalJSON(matchCRN(intialArray))
        setFormattedData(true)
    }

    const handleFormat = () => {
        if (isAnyKeyEmpty(userInput)) {
            setEmptyInput(true)
        } else {
            readXLSX()
        }
    }

    function isAnyKeyEmpty(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key]
                if (value === null || value === undefined || value === '') {
                    return true
                }
            }
        }
        return false
    }

    const padWithZeros = (num) => {
        return num.toString().padStart(3, "0")
    }

    const returnCampus = (course) => {
        let campus
        switch (course["CAMPUS"]) {
            case "MPC":
                campus = "1"
                break
            case "MCV":
                campus = "2"
                break
            default:
                break
        }
        return campus
    }

    const returnProfLastName = (prof) => {
        let professorName

        if (prof) {
            professorName = prof.toUpperCase()
        } else {
            professorName = "TBD"
        }
        return professorName
    }

    return (
        <div className="container-fluid bg-dark vh-100 mx-0 text-white">
            <div className="row">
                <div className="col mt-3 mb-3">
                    <Link to="/" className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg>
                    </Link>
                </div>
            </div>
            <FormatForm emptyInput={emptyInput}
                handleUserInputChange={handleUserInputChange}
                handleFormat={handleFormat}
                finalJSON={finalJSON}
                userInput={userInput} />
            <Footer />
        </div>
    )
}