const BDTable = ({ BDData }) => {
    return (
        <div className="flex-grow-1 overflow-auto mt-3"
            style={{ "height": "75vh", "overflowY": "auto" }}>
            <table className="table table-bordered table-striped table-hover">
                <thead className="sticky-top top-0">
                    <tr>
                        <th scope="col">ISBN</th>
                        <th scope="col">Title</th>
                        <th scope="col" className="text-center">Enrl</th>
                        <th scope="col" className="text-center">BD</th>
                        <th scope="col" className="text-center">New</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(BDData).map((ISBN, key) => {
                        return (
                            <tr key={key}>
                                <th scope="row">{ISBN}</th>
                                <td>{BDData[ISBN].Title}</td>
                                <td>{BDData[ISBN].Enrollment}</td>
                                <td>{BDData[ISBN].Decision}</td>
                                <td>{BDData[ISBN].CalcBD}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default BDTable