export const MatchTable = ({ matchedArr, handleOfferingChange, handleSecondSubmit }) => {
    return (
        <>
            <div className="row">
                <div className="col">
                    {matchedArr.filter(course => course["Offering_Num"] === "000" || course["Offering_Num"] === "").length} missing section(s)
                </div>
            </div>
            <div className="row">
                <div className="col mx-auto">
                    <div className="table-responsive rounded"
                        style={{ "height": "70vh" }}>
                        <table className="table table-bordered table-dark p-0">
                            <thead className="sticky-top p-0">
                                <tr className="align-middle" style={{ "border": 0 }}>
                                    <th style={{ "border": 0 }}>CRN</th>
                                    <th style={{ "border": 0 }}>Course</th>
                                    <th style={{ "border": 0 }}>Section</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(matchedArr).map((index, key) => {
                                    if (matchedArr[index]["Offering_Num"] === "" || matchedArr[index]["Offering_Num"] === "000")
                                        return (
                                            <tr key={key}>
                                                <td>{matchedArr[index]["CRN"]}</td>
                                                <td>{`${matchedArr[index]["Subject"]} ${matchedArr[index]["Course_Num"]}`}</td>
                                                <td><input type="text" className="form-control bg-dark text-white" id={`${matchedArr[index]["CRN"]}`} onChange={handleOfferingChange} maxLength={3} /></td>
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
            <div className="row mt-3 text-center">
                <div className="col">
                    <button className="btn btn-secondary" onClick={handleSecondSubmit}>Submit</button>
                </div>
            </div>
        </>
    )
}