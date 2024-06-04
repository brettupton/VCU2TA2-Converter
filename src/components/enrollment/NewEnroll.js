import { useState, useEffect } from "react"

export const NewEnroll = () => {
    const [enrollInfo, setEnrollInfo] = useState({
        term: "",
        year: 0,
        enrollFile: {
            path: "",
            name: ""
        }
    })

    const [formatInfo, setFormatInfo] = useState({
        name: "",
        fileExists: null
    })
    const [matchedArr, setMatchedArr] = useState([])
    const [formatInfoGot, setFormatInfoGot] = useState(false)
    const [firstUploadGot, setfirstUploadGot] = useState(false)

    useEffect(() => {
        setFormatInfoGot(false)
        if (["Fall", "Spring", "Summer"].includes(enrollInfo["term"]) &&
            ["24", "25", "26"].includes(enrollInfo["year"])) {
            window.ipcRenderer.send('format-file-check', enrollInfo)
        }
    }, [enrollInfo])

    useEffect(() => {
        if (formatInfo.fileExists !== null) {
            setFormatInfoGot(true)
        }
    }, [formatInfo])

    useEffect(() => {
        if (matchedArr.length > 0) {
            setfirstUploadGot(true)
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
        const { currentTarget } = e

        if (currentTarget.files) {
            const file = currentTarget.files[0]

            setEnrollInfo(prev => ({
                ...prev,
                enrollFile: {
                    path: file.path,
                    name: file.name.split('.')[0]
                }
            }))
        }
    }

    // Send enrollment file to match with previous
    const handleFirstUpload = () => {
        window.ipcRenderer.send('first-upload', enrollInfo)
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


    return (
        <div className="container-fluid bg-dark vh-100 mx-0 text-white">
            <div className="row pt-5">
                <div className="col">
                    <div className="row">
                        <div className="col">
                            <input type="text" onChange={handleEnrollChange} id="term" placeholder="Term" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <small>Summer, Spring, or Fall</small>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <input type="text" onChange={handleEnrollChange} id="year" placeholder="Year" maxLength={2} />
                </div>
            </div>
            <div className="row pt-5">
                <div className="col">
                    <input type="file" onChange={handleFileChange} accept=".xlsx" />
                </div>
            </div>
            {formatInfoGot ?
                formatInfo.fileExists ?
                    <div className="row mt-5">
                        <div className="col">
                            Previously Formatted File: {formatInfo["name"]}
                        </div>
                    </div>
                    :
                    <>
                        <div className="row mt-5">
                            <div className="col">
                                Previously Formatted File not found for Term
                            </div>
                        </div>
                        <div className="row mt-5">
                            <div className="col">
                                <input type="file" accept=".csv" />
                            </div>
                        </div>
                    </>
                :
                <div className="row">
                    <div className="col">

                    </div>
                </div>
            }
            <div className="row mt-3">
                <div className="col">
                    <button className="btn btn-secondary" onClick={handleFirstUpload}>Submit</button>
                </div>
            </div>
            {firstUploadGot &&
                <div className="container-fluid">
                    <div className="row">
                        <div className="col mx-auto">
                            <div className="table-responsive rounded"
                                style={{ "height": "92vh" }}>
                                <table className="table table-bordered table-dark">
                                    <thead className="sticky-top top-0" style={{ "padding": 0 }}>
                                        <tr className="align-middle" style={{ "border": 0 }}>
                                            <th style={{ "border": 0 }}>CRN</th>
                                            <th style={{ "border": 0 }}>Course</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(matchedArr).map((index, key) => {
                                            if (matchedArr[index]["Offering_Num"] === "000")
                                                return (
                                                    <tr key={key}>
                                                        <td>{matchedArr[index]["CRN"]}</td>
                                                        <td>{`${matchedArr[index]["Subject"]} ${matchedArr[index]["Course_Num"]} ${matchedArr[index]["Offering_Num"]}`}</td>
                                                    </tr>
                                                )
                                            return ("")
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}