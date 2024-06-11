const HoriSalesTable = ({ searchResult, handleEnrollmentChange, enrollment }) => {
    const years = [15, 16, 17, 18, 19, 20, 21, 22, 23]

    const ISBN = Object.keys(searchResult)[0]
    const searchBook = searchResult[ISBN]

    let count = 0;

    years.forEach(year => {
        const semesterInfo = searchBook.Semesters?.["F" + year];
        if (semesterInfo) {
            if (semesterInfo.Enrollment) {
                count++;
            }
        }
    });

    const averageEnrollment = count > 0 ? (searchBook.totalEnrollment / count).toFixed(0) : 0;
    const averageSales = count > 0 ? (searchBook.totalSales / count).toFixed(0) : 0;
    const averageSE = searchBook.averageSalesPerEnrollment ? (searchBook.averageSalesPerEnrollment) : 0
    const ISBNBD = searchBook?.averageSalesPerEnrollment ? Math.ceil(enrollment * searchBook.averageSalesPerEnrollment) : Math.ceil(enrollment / 5)

    return (
        <div className="container-fluid p-0">
            <div className="row mt-3">
                <div className="col">
                    {ISBN}
                </div>
            </div>
            <div className="row mt-1">
                <div className="col">
                    {searchBook.Title}
                </div>
            </div>
            <div className="row justify-content-middle">
                <div className="col-lg-2 col-sm-6">
                    <div className="input-group mt-3">
                        <span className="input-group-text" id="enrollment">Enrollment</span>
                        <input type="text" className="form-control" aria-label="Enrollment" aria-describedby="enrollment" onChange={handleEnrollmentChange} />
                    </div>
                </div>
                <div className="col-lg-2 col-sm-6">
                    <div className="input-group mt-3">
                        <span className="input-group-text" id="Decision">Decision</span>
                        <input type="text" className="form-control" value={ISBNBD} aria-label="Decision" aria-describedby="Decision" maxLength={5} disabled />
                    </div>
                </div>
            </div>
            <div className="row mx-0 my-3">
                <div className="col mx-auto">
                    <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
                        <div className="table-responsive rounded">
                            <table className="table table-striped table-hove table-bordered">
                                <thead className="sticky-top">
                                    <tr className="align-middle">
                                        <th>Term</th>
                                        <th className="text-center">Enrl</th>
                                        <th className="text-center">Sales</th>
                                        <th className="text-center">S/E</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {years.map((year, key) => {
                                        const semesterInfo = searchBook.Semesters?.["F" + year]
                                        return (
                                            <tr key={key}>
                                                <th scope="row">{"F" + year}</th>
                                                <td className="text-center">{semesterInfo ? semesterInfo.Enrollment : ""}</td>
                                                <td className="text-center">{semesterInfo ? semesterInfo.Sales : ""}</td>
                                                <td className="text-center">{semesterInfo ? semesterInfo.Enrollment !== 0 ? (semesterInfo.Sales / semesterInfo.Enrollment).toFixed(2) : "" : ""}</td>
                                            </tr>
                                        )
                                    })}
                                    <tr className="border-2 border-black">
                                        <th scope="row">Avg</th>
                                        <td className="text-center">{averageEnrollment}</td>
                                        <td className="text-center">{averageSales}</td>
                                        <td className="text-center">{averageSE}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* TODO: Click on Term and show full course list */}
                <div className="col mx-auto">
                    <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
                        <div className="table-responsive rounded">
                            <table className="table table-striped table-hover">
                                <thead className="sticky-top">
                                    <tr className="align-middle">
                                        <th>Term</th>
                                        <th>Course</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {years.map((year, key) => {
                                        const semesterInfo = searchBook.Semesters?.["F" + year]
                                        return (
                                            <tr key={key}>
                                                <th scope="row">{"F" + year}</th>
                                                <td colSpan={2}>{semesterInfo ? semesterInfo.Courses[0] : ""}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HoriSalesTable