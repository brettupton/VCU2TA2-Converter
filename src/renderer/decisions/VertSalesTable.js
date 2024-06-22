export const VertSalesTable = ({ currBook, term, handleEnrollmentChange, calcEnrollment }) => {
  const years = [15, 16, 17, 18, 19, 20, 21, 22, 23].reverse()

  const numSemesters = Object.keys(currBook.semesters).length

  const averageEnrl = numSemesters > 0 ? (currBook.total_act_enrl / numSemesters).toFixed(0) : 0
  const averageSales = numSemesters > 0 ? (currBook.total_act_sales / numSemesters).toFixed(0) : 0
  const calcBD = (currBook.total_act_sales / currBook.total_act_enrl) ? Math.ceil(calcEnrollment * (currBook.total_act_sales / currBook.total_act_enrl || 0)) : Math.ceil(calcEnrollment * 0.2)

  return (
    <div className="container-fluid p-0">
      <div className="row">
        <div className="col">
          {currBook.ISBN}
        </div>
      </div>
      <div className="row mt-1">
        <div className="col">
          {currBook.title}
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
                        <td className="text-center">{currBook.semesters[term + year] ? currBook.semesters[term + year].act_enrl : ""}</td>
                        <td className="text-center">{currBook.semesters[term + year] ? currBook.semesters[term + year].act_sales : ""}</td>
                        <td className="text-center">{
                          currBook.semesters[term + year] ? (currBook.semesters[term + year].act_sales / currBook.semesters[term + year].act_enrl || 0).toFixed(4) : ""
                        }</td>
                      </tr>
                    )
                  })}
                  <tr className="border-2 border-black">
                    <th scope="row">Avg</th>
                    <td className="text-center">{averageEnrl}</td>
                    <td className="text-center">{averageSales}</td>
                    <td className="text-center">{currBook.total_act_sales / currBook.total_act_enrl || 0}</td>
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
          <div style={{ maxHeight: "38vh", overflowY: "auto" }}>
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
                    const semesterInfo = currBook?.semesters[term + year]
                    return (
                      <tr key={key}>
                        <th scope="row">{term + year}</th>
                        <td colSpan={2}>{semesterInfo ? semesterInfo.courses[0].course : ""}</td>
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