import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const MissingCRN = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [emptySections, setEmptySections] = useState([])
    const [finalJSON, setFinalJSON] = useState(location.state.finalJSON)
    const [sectionsSubmitted, setSectionsSubmitted] = useState(false)

    const rawFileName = location.state.userInput.XLSXFileName

    useEffect(() => {
        findEmptySections()
    }, [])

    const findEmptySections = () => {
        const emptySections = []

        for (let course of finalJSON) {
            if (course["Offering_Num"] === "000") {
                const emptySectionCourse = {
                    CRN: course["CRN"],
                    Title: course["Title"],
                    Subject: course["Subject"],
                    Course_Num: course["Course_Num"]
                }
                emptySections.push(emptySectionCourse)
            }
        }
        setEmptySections(emptySections)
    }

    const handleSectionChange = (e) => {
        const CRN = e.currentTarget.id
        const newSection = e.currentTarget.value

        const dupeEmptySections = emptySections

        for (const course of dupeEmptySections) {
            if (course["CRN"] === CRN) {
                course["Offering_Num"] = newSection
            }
        }

        setEmptySections(dupeEmptySections)
    }

    const fillEmptySections = () => {
        const newFinalJSON = finalJSON
        for (const course of emptySections) {
            for (let i = 0; i < newFinalJSON.length; i++) {
                if (newFinalJSON[i]["CRN"] === course["CRN"]) {
                    newFinalJSON[i]["Offering_Num"] = course["Offering_Num"]

                }
            }
        }
        setFinalJSON(newFinalJSON)
        setSectionsSubmitted(true)
    }

    const createCSVFile = (JSON) => {
        const fileIndex = rawFileName.indexOf(".")
        const fileName = rawFileName.substring(0, fileIndex)

        window.ipcRenderer.send('createCSVFile', { data: JSON, fileName: fileName })
    }

    window.ipcRenderer.on('download-success', (event) => {
        navigate('/')
    })

    const handleSubmitOrDownload = (e) => {
        const innerText = e.currentTarget.innerHTML

        if (innerText === "Submit") {
            fillEmptySections()
        } else if (innerText === "Download") {
            createCSVFile(finalJSON)
        }
    }

    window.ipcRenderer.on('CSV-error', (event, err) => {
        console.error(err)
    })

    return (
        <div className="container">
            <div className="row mb-3">
                <div className="col">
                    Missing Sections:
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">CRN</th>
                        <th scope="col">Dept</th>
                        <th scope="col">Course</th>
                        <th scope="col">Section</th>
                    </tr>
                </thead>
                <tbody>
                    {emptySections.map((course, index) => {
                        return (
                            <tr key={index}>
                                <td>{course["CRN"]}</td>
                                <td>{course["Subject"]}</td>
                                <td>{course["Course_Num"]}</td>
                                <td><input type="text" id={course["CRN"]} placeholder="Section" onChange={handleSectionChange} maxLength={3} /></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="row">
                <div className="col">
                    If you leave these blank, sections will be autofilled as 000
                </div>
            </div>
            <div className="row text-center mt-5">
                <div className="col">
                    <button className="btn btn-primary" onClick={handleSubmitOrDownload}>{!sectionsSubmitted ? "Submit" : "Download"}</button>
                </div>
            </div>
        </div>
    )
}