export const FormatForm = ({ emptyInput, handleUserInputChange, handleFormat }) => {

    return (
        <div className="text-center">
            <div className="row">
                <div className="col m-3">
                    <h3>Enrollment File Formatter</h3>
                </div>
            </div>
            <div className="row mt-3 justify-content-center">
                <div className="col-4">
                    <select className="form-select form-select-sm" id="term" defaultValue={""} onChange={handleUserInputChange}>
                        <option value="">Term</option>
                        <option value="F">Fall</option>
                        <option value="W">Spring</option>
                        <option value="A">Summer</option>
                    </select>
                </div>
                <div className="col-4">
                    <input type="text" className="form-control-sm" id="year" maxLength={2} placeholder="Year" onChange={handleUserInputChange} />
                </div>
            </div>
            <div className="row mt-5 justify-content-center">
                <div className="col-6">
                    <input className="form-control" type="file" id="XLSXFile" accept=".xlsx" onChange={handleUserInputChange} />
                    <label htmlFor="XLSXFile" className="form-label fst-italic"><small>XLSX Enrollment File</small></label>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-6">
                    <input className="form-control" type="file" id="CSVFile" accept=".csv" onChange={handleUserInputChange} />
                    <label htmlFor="CSVFile" className="form-label fst-italic"><small>Formatted CSV File</small></label>
                </div>
            </div>
            {emptyInput &&
                <div className="container text-center text-warning">
                    <div className="row">
                        <div className="col">
                            Please fill out all inputs
                        </div>
                    </div>
                </div>
            }
            <div className="row">
                <div className="col">
                    <button className="btn btn-secondary" onClick={handleFormat}>Format</button>
                </div>
            </div>
        </div>
    )
}