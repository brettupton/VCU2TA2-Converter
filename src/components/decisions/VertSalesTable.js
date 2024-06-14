export const VertSalesTable = ({ currBook, term, handleEnrollmentChange, enrollment }) => {
  const years = [15, 16, 17, 18, 19, 20, 21, 22, 23]

  let count = 0

  console.log(currBook)

  years.forEach(year => {
    if (currBook && currBook.Semesters && currBook.Semesters[term + year]) {
      const semester = currBook.Semesters[term + year]
      console.log(currBook, currBook.Semesters)
      if (semester.Enrollment) {
        count++
      }
    }
  })

  const averageEnrollment = count > 0 ? (currBook?.totalEnrollment / count).toFixed(0) : 0;
  const averageSales = count > 0 ? (currBook?.totalSales / count).toFixed(0) : 0;
  const averageSE = currBook?.averageSalesPerEnrollment ? (currBook.averageSalesPerEnrollment) : 0
  const ISBNBD = currBook?.averageSalesPerEnrollment ? Math.ceil(enrollment * currBook.averageSalesPerEnrollment) : Math.ceil(enrollment / 5)

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
            <input type="text" className="form-control" aria-label="Enrollment" aria-describedby="enrollment" onChange={handleEnrollmentChange} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="input-group mt-3">
            <span className="input-group-text" id="Decision">Decision</span>
            <input type="text" className="form-control" value={ISBNBD} aria-label="Decision" aria-describedby="Decision" maxLength={5} disabled />
          </div>
        </div>
      </div>
      <div className="row mx-0 pt-2 my-1">
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
                    const semesterInfo = currBook?.Semesters[term + year]
                    return (
                      <tr key={key}>
                        <th scope="row">{term + year}</th>
                        <td className="text-center">{semesterInfo ? semesterInfo.Enrollment : ""}</td>
                        <td className="text-center">{semesterInfo ? semesterInfo.Sales : ""}</td>
                        <td className="text-center">{semesterInfo ? semesterInfo.Enrollment !== 0 ? (semesterInfo.Sales / semesterInfo.Enrollment).toFixed(4) : "" : ""}</td>
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