export const EnrollForm = ({ handleEnrollChange, handleFileChange, handleFirstSubmit, formatInfo, formFilled, formatFilled }) => {
    return (
        <div className="container m-0">
            <div className="row mt-3">
                <div className="col-2">
                    <input type="text" className="form-control" onChange={handleEnrollChange} id="term" placeholder="Term" maxLength={1} />
                </div>
                <div className="col-2">
                    <input type="text" className="form-control" onChange={handleEnrollChange} id="year" placeholder="Year" maxLength={2} />
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-5">
                    <input type="file" className="form-control" onChange={handleFileChange} id="enrollFile" accept=".xlsx" />
                    <label htmlFor="enrollFile" className="form-label"><small>Enrollment File</small></label>
                </div>
            </div>
            {formatInfo.fileExists &&
                <div className="row mt-4">
                    <div className="col">
                        Latest Formatted File: {formatInfo.name}
                    </div>
                </div>
            }
            {formatInfo.fileExists === false &&
                <>
                    {!formatFilled &&
                        <div className="row mt-4">
                            <div className="col">
                                <p className="text-danger m-0"><small>No Format File Found for Term Specified</small></p>
                            </div>
                        </div>
                    }
                    <div className="row mt-2">
                        <div className="col-5">
                            <input type="file" className="form-control" onChange={handleFileChange} id="formatFile" accept=".csv" />
                            <label htmlFor="formatFile" className="form-label"><small>Format File</small></label>
                        </div>
                    </div>
                </>
            }
            {formFilled &&
                <div className="row mt-3">
                    <div className="col">
                        <button className="btn btn-secondary" onClick={handleFirstSubmit}>Submit</button>
                    </div>
                </div>
            }
        </div>
    )
}