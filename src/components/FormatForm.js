export const FormatForm = ({ emptyInput, handleUserInputChange, handleFormat }) => {

    return (
        <div className="text-center">
            <div className="row">
                <div className="col m-3">
                    Enrollment File Formatter
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <select className="form-select form-select-sm" id="term" defaultValue={""} onChange={handleUserInputChange}>
                        <option value="">Term</option>
                        <option value="F">Fall</option>
                        <option value="W">Spring</option>
                        <option value="A">Summer</option>
                    </select>
                </div>
                <div className="col">
                    <input type="text" className="form-control-sm" id="year" maxLength={2} placeholder="Year" onChange={handleUserInputChange} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <input className="form-control" type="file" id="XLSXFile" accept=".xlsx" onChange={handleUserInputChange} />
                    <label htmlFor="XLSXFile" className="form-label">Upload XLSX Enrollment File</label>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <input className="form-control" type="file" id="CSVFile" accept=".csv" onChange={handleUserInputChange} />
                    <label htmlFor="CSVFile" className="form-label">Upload Previous Formatted CSV File</label>
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
                    <button className="btn btn-primary" onClick={handleFormat}>Format</button>
                </div>
            </div>
        </div>
    )
}