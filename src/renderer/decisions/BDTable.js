export const BDTable = ({ BDData, sortAlpha, bdDisplay, latestDate, handleISBNClick }) => {

    const filteredBDData = Object.keys(BDData).filter((ISBN) => {
        const difference = BDData[ISBN].Diff
        if (bdDisplay === 'all') return true
        if (bdDisplay === 'far' && difference > 5) return true
        if (bdDisplay === 'close' && difference > 0 && difference <= 5) return true
        if (bdDisplay === 'exact' && difference === 0) return true
        return false
    })

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col mx-auto">
                    <div className="table-responsive rounded"
                        style={{ "height": "89vh" }}>
                        <table className="table table-bordered">
                            <thead className="sticky-top top-0 table-dark" style={{ "padding": 0 }}>
                                <tr className="align-middle" style={{ "border": 0 }}>
                                    <th style={{ "border": 0 }}>ISBN</th>
                                    <th style={{ "border": 0 }}>
                                        <button type="button" className="btn btn-link" onClick={sortAlpha}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-sort-alpha-down" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z" />
                                                <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z" />
                                            </svg>
                                        </button>
                                        Title
                                    </th>
                                    <th className="text-center" style={{ "border": 0 }}>Enrl</th>
                                    <th className="text-center" style={{ "border": 0 }}>Est</th>
                                    <th className="text-center" style={{ "border": 0 }}>BD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBDData.map((ISBN, key) => (
                                    <tr key={key} className={
                                        BDData[ISBN].Diff === 0 ?
                                            "table-success" : BDData[ISBN].Diff > 5 ?
                                                "table-danger" :
                                                "table-warning"} onClick={() => handleISBNClick(ISBN, BDData[ISBN].Title)}>
                                        <td>{ISBN}</td>
                                        <td>{BDData[ISBN].Title}</td>
                                        <td className="text-center">{BDData[ISBN].Enrollment}</td>
                                        <td className="text-center">{BDData[ISBN].Decision}</td>
                                        <td className="text-center">{BDData[ISBN].CalcBD}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="row justify-content-between">
                <div className="col-3">
                    {latestDate.length > 0 && `Last BD: ${latestDate}`}
                </div>
                <div className="col-1">
                    {filteredBDData.length} / {Object.keys(BDData).length}
                </div>
            </div>
        </div>
    )
}
