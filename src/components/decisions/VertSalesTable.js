export const VertSalesTable = ({ currBook, term, handleEnrollmentChange, calcEnrollment }) => {
  const years = [15, 16, 17, 18, 19, 20, 21, 22, 23]

  const numSemesters = Object.keys(currBook.Semesters).length

  const averageEnrl = numSemesters > 0 ? (currBook.totalEnrl / numSemesters).toFixed(0) : 0
  const averageSales = numSemesters > 0 ? (currBook.totalSales / numSemesters).toFixed(0) : 0
  const calcBD = currBook.avgSE ? Math.ceil(calcEnrollment * currBook.avgSE) : Math.ceil(calcEnrollment / 5)

  return (
    <div className="container-fluid p-0">
      <div className="row">
        <div className="col">
          {currBook.ISBN}
        </div>
      </div>
      <div className="row mt-1">
        <div className="col">
          {currBook.Title}
        </div>
      </div>
      <div className="row justify-content-middle">
        <div className="col-lg-4">
          <div className="input-group mt-3">
            <span className="input-group-text" id="enrollment">Enrollment</span>
            <input type="number" className="form-control" aria-label="Enrollment" aria-describedby="enrollment" maxLength={5} onChange={handleEnrollmentChange} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="input-group mt-3">
            <span className="input-group-text" id="Decision">Decision</span>
            <input type="text" className="form-control" value={calcBD} aria-label="Decision" aria-describedby="Decision" disabled />
          </div>
        </div>
      </div>
      <div className="row mx-0 mt-1">
        <div className="col mx-auto">
          <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
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
                    return (
                      <tr key={key}>
                        <th scope="row">{term + year}</th>
                        <td className="text-center">{currBook.Semesters[term + year] ? currBook.Semesters[term + year].Enrl : ""}</td>
                        <td className="text-center">{currBook.Semesters[term + year] ? currBook.Semesters[term + year].Sales : ""}</td>
                        <td className="text-center">{
                          currBook.Semesters[term + year] ? currBook.Semesters[term + year].Enrl > 0 ? (currBook.Semesters[term + year].Sales / currBook.Semesters[term + year].Enrl).toFixed(4) : "" : ""
                        }</td>
                      </tr>
                    )
                  })}
                  <tr className="border-2 border-black">
                    <th scope="row">Avg</th>
                    <td className="text-center">{averageEnrl}</td>
                    <td className="text-center">{averageSales}</td>
                    <td className="text-center">{currBook.avgSE}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* TODO: Click on Term and show full course list */}
      <div className="row mx-0">
        <div className="col mx-auto">
          <div style={{ maxHeight: "35vh", overflowY: "auto" }}>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="sticky-top">
                  <tr className="align-middle">
                    <th>Term</th>
                    <th>Course</th>
                  </tr>
                </thead>
                <tbody>
                  {years.map((year, key) => {
                    const semesterInfo = currBook?.Semesters[term + year]
                    return (
                      <tr key={key}>
                        <th scope="row">{term + year}</th>
                        <td colSpan={2}>{semesterInfo ? semesterInfo.Courses[0].Course : ""}</td>
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