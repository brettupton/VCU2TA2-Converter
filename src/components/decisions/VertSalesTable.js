const VertSalesTable = ({ salesData, currBook }) => {
  const years = [15, 16, 17, 18, 19, 20, 21, 22, 23]

  let count = 0;

  years.forEach(year => {
    const semesterInfo = salesData[currBook.ISBN]?.Semesters["F" + year];
    if (semesterInfo) {
      if (semesterInfo.Enrollment) {
        count++;
      }
    }
  });

  const averageEnrollment = count > 0 ? (salesData[currBook.ISBN]?.totalEnrollment / count).toFixed(0) : 0;
  const averageSales = count > 0 ? (salesData[currBook.ISBN]?.totalSales / count).toFixed(0) : 0;
  const averageSE = salesData[currBook.ISBN]?.averageSalesPerEnrollment ? (salesData[currBook.ISBN].averageSalesPerEnrollment) : 0

  return (
    <div className="container-fluid p-0">
      <div className="row mt-3">
        <div className="col">
          {currBook.ISBN}
        </div>
      </div>
      <div className="row mt-1">
        <div className="col">
          {currBook.Title}
        </div>
      </div>
      <div className="row mx-0 my-1">
        <div className="col mx-auto">
          <div style={{ maxHeight: "42vh", overflowY: "auto" }}>
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
                    const semesterInfo = salesData[currBook.ISBN]?.Semesters["F" + year]
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
                    const semesterInfo = salesData[currBook.ISBN]?.Semesters["F" + year]
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

export default VertSalesTable