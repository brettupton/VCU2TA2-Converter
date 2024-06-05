export const MatchTable = ({ matchedArr }) => {
    return (
        <div className="row">
            <div className="col mx-auto">
                <div className="table-responsive rounded"
                    style={{ "height": "92vh" }}>
                    <table className="table table-bordered table-dark">
                        <thead className="sticky-top p-0">
                            <tr className="align-middle">
                                <th>CRN</th>
                                <th>Course</th>
                                <th>Section</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(matchedArr).map((index, key) => {
                                if (matchedArr[index]["Offering_Num"] === "")
                                    return (
                                        <tr key={key}>
                                            <td>{matchedArr[index]["CRN"]}</td>
                                            <td>{`${matchedArr[index]["Subject"]} ${matchedArr[index]["Course_Num"]}`}</td>
                                            <td><input type="text" /></td>
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
    )
}