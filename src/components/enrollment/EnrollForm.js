export const EnrollForm = ({ handleEnrollChange, handleFileChange, handleFirstSubmit, formatInfo, formatInfoGot }) => {
    return (
        <>
            <div className="row pt-1">
                <div className="col">
                    <select className="form-select form-select-sm" id="term" defaultValue={""} onChange={handleEnrollChange}>
                        <option value="">Term</option>
                        <option value="Fall">Fall</option>
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                    </select>
                    <div className="row pt-5">
                        <div className="col">
                            <input type="file" onChange={handleFileChange} accept=".xlsx" />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <input type="text" onChange={handleEnrollChange} id="year" placeholder="Year" maxLength={2} />
                </div>
            </div>
            {formatInfoGot ?
                formatInfo.fileExists ?
                    <div className="row mt-5">
                        <div className="col">
                            Latest Formatted File: {formatInfo["name"]}
                        </div>
                    </div>
                    :
                    <>
                        <div className="row mt-5">
                            <div className="col">
                                Latest Formatted File Unavailable
                            </div>
                        </div>
                        <div className="row mt-5">
                            <div className="col">
                                <input type="file" accept=".csv" />
                            </div>
                        </div>
                    </>
                :
                <div className="row mt-5">
                    <div className="col">

                    </div>
                </div>
            }
            <div className="row mt-2 text-center">
                <div className="col">
                    <button className="btn btn-secondary" onClick={handleFirstSubmit}>Submit</button>
                </div>
            </div>
        </>
    )
}