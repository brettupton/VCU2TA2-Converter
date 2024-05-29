const SalesTable = ({ salesData }) => {
  const years = [15, 16, 17, 18, 19, 20, 21, 22, 23]

  return (
    <div className="flex-grow-1 overflow-auto"
      style={{ "height": "75vh", "overflowY": "auto" }}>
      <table className="table table-bordered table-striped table-hover">
        <thead className="sticky-top top-0">
          <tr>
            <th scope="col">ISBN</th>
            <th scope="col">Title</th>
            <th scope="col" className="text-center">F15</th>
            <th scope="col" className="text-center">F16</th>
            <th scope="col" className="text-center">F17</th>
            <th scope="col" className="text-center">F18</th>
            <th scope="col" className="text-center">F19</th>
            <th scope="col" className="text-center">F20</th>
            <th scope="col" className="text-center">F21</th>
            <th scope="col" className="text-center">F22</th>
            <th scope="col" className="text-center">F23</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(salesData).map((isbn, key) => {
            const bookInfo = salesData[isbn];
            return (
              <tr key={isbn}>
                <th scope="row">{isbn}</th>
                <td>{bookInfo.Title}</td>
                {years.map((year, key) => {
                  //TODO: Change F to term selection
                  const semesterInfo = bookInfo.Semesters["F" + year]
                  return (
                    //TODO: Hover over and show detailed enrollment and sales
                    semesterInfo === undefined ?
                      <td key={key}></td> :
                      <td className="text-center" key={key}>{semesterInfo.SalesPerEnrl}</td>
                  )
                })}
              </tr>
            )
          })}

        </tbody>
      </table>
    </div>
  )
}

export default SalesTable