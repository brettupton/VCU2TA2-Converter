import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MatchTable } from "./MatchTable"
import { EnrollForm } from "./EnrollForm"

export const EnrollHome = () => {
    const [enrollInfo, setEnrollInfo] = useState({
        term: "",
        year: 0,
        enrollFile: {
            path: "",
            name: ""
        },
        formatFile: {
            path: "",
            name: ""
        }
    })

    const [formatInfo, setFormatInfo] = useState({
        name: "",
        fileExists: null
    })
    const [newOfferingInfo, setNewOfferingInfo] = useState({})
    const [matchedArr, setMatchedArr] = useState([])
    const [firstSubmitGot, setfirstSubmitGot] = useState(false)
    const [formFilled, setFormFilled] = useState(false)
    const [formatFilled, setFormatFilled] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (["F", "W", "A"].includes(enrollInfo["term"]) &&
            ["24", "25", "26"].includes(enrollInfo["year"])) {
            window.ipcRenderer.send('format-file-check', enrollInfo)
        }

        setFormFilled(isFormFilled(enrollInfo))
        setFormatFilled(enrollInfo["formatFile"]["path"] !== "")
        console.log(enrollInfo["formatFile"]["path"])

    }, [enrollInfo])

    useEffect(() => {
        if (matchedArr.length > 0) {
            setfirstSubmitGot(true)

            for (const course of matchedArr) {
                if (course["Offering_Num"] === "")
                    setNewOfferingInfo(prev => ({
                        ...prev,
                        [course["CRN"]]: "000"
                    }))
            }
        }
    }, [matchedArr])

    const handleEnrollChange = (e) => {
        const { value, id } = e.currentTarget

        setEnrollInfo(prev => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleFileChange = (e) => {
        const { files, id } = e.currentTarget

        if (files) {
            const file = files[0]

            setEnrollInfo(prev => ({
                ...prev,
                [id]: {
                    path: file.path,
                    name: file.name.split('.')[0]
                }
            }))
        }
    }

    // Send enrollment file to match with previous
    const handleFirstSubmit = () => {
        window.ipcRenderer.send('first-submit', enrollInfo)
    }

    const handleOfferingChange = (e) => {
        const { id, value } = e.currentTarget

        setNewOfferingInfo(prev => ({
            ...prev,
            [id]: value
        }))
    }

    //Send back enrollment file with user filled offerings
    const handleSecondSubmit = () => {
        window.ipcRenderer.send('second-submit', { enroll: matchedArr, offering: newOfferingInfo, fileName: enrollInfo["enrollFile"]["name"] })

    }

    const nonEmpty = (value) => {
        if (typeof value === 'string') return value.trim() !== ''
        if (typeof value === 'number') return value !== 0
        if (typeof value === 'object' && value !== null) return isFormFilled(value)
        return false
    }

    const isFormFilled = (obj) => {
        const { formatFile, ...rest } = obj
        return Object.values(rest).every(nonEmpty)
    }

    window.ipcRenderer.on('format-file-result', (event, data) => {
        setFormatInfo({
            name: data.fileName,
            fileExists: data.fileExists
        })
    })

    window.ipcRenderer.on('matched', (event, data) => {
        // Sort by Subject, then Course_Num, then Offering_Num
        setMatchedArr(
            data.matched.sort((a, b) => {
                if (a.Subject < b.Subject) return -1;
                if (a.Subject > b.Subject) return 1;

                const courseNumA = parseInt(a.Course_Num, 10);
                const courseNumB = parseInt(b.Course_Num, 10);

                if (courseNumA < courseNumB) return -1;
                if (courseNumA > courseNumB) return 1;

                const offeringNumA = parseInt(a.Offering_Num, 10);
                const offeringNumB = parseInt(b.Offering_Num, 10);

                if (offeringNumA < offeringNumB) return -1;
                if (offeringNumA > offeringNumB) return 1;

                return 0;
            })
        )
    })

    window.ipcRenderer.on('download-success', (event) => {
        navigate(0)
    })

    return (
        <div className="container-fluid bg-dark vh-100 mx-0 text-white">
            <div className="row">
                <div className="col mt-3 mb-3">
                    {firstSubmitGot ?
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
            {firstSubmitGot ?
                <MatchTable matchedArr={matchedArr}
                    handleOfferingChange={handleOfferingChange}
                    handleSecondSubmit={handleSecondSubmit} />
                :
                <EnrollForm
                    handleEnrollChange={handleEnrollChange}
                    handleFileChange={handleFileChange}
                    handleFirstSubmit={handleFirstSubmit}
                    formatInfo={formatInfo}
                    formFilled={formFilled}
                    formatFilled={formatFilled}
                />
            }
        </div>
    )
}