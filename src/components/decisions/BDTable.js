const BDTable = ({ BDData }) => {
    return (
        <div className="container mt-2">
            <div className="row">
                <div className="col-lg-8 col-12">
                    <div className="table-responsive"
                        style={{ "height": "75vh" }}>
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
                </div>
            </div>
        </div>
    )
}

export default BDTable