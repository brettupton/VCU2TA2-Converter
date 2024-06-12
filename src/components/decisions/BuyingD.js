import { Link } from "react-router-dom"

export const BuyingD = () => {
    return (
        <div className="container-fluid bg-dark vh-100 mx-0 text-white">
            <div className="row">
                <div className="col mt-3 mb-1">
                    <Link to="/" className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg>
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="col-2">
                    <div className="input-group">
                        <input type="text" className="form-control" id="inputGroupText" aria-describedby="inputGroupText" aria-label="Term" placeholder="Term"
                            maxLength={1} />
                        <button className="btn btn-outline-secondary" type="button" id="inputGroupText">Run</button>
                    </div>
                </div>
            </div>
        </div>
    )
}