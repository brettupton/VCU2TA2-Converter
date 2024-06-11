import { Link } from "react-router-dom"

export const DevHome = () => {
    return (
        <div className="container-fluid bg-dark vh-100 mx-0 text-white">
            <div className="row">
                <div className="col mt-3 mb-3">
                    <Link to="/" className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg>
                    </Link>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-lg-4 col-sm-8">
                    <div className="input-group">
                        <input type="file" className="form-control" id="inputGroupFile" aria-describedby="inputGroupFile" aria-label="Upload" />
                        <button className="btn btn-outline-secondary" type="button" id="inputGroupFile">Submit</button>
                    </div>
                </div>
            </div>
            <div className="row mt-1">
                <div className="col">
                    <small>Format: Term, Dept/Course, Title, ISBN, Act Enrl, Act Sales</small>
                </div>
            </div>
        </div>
    )
}