import { Footer } from "./Footer"
import { Link } from "react-router-dom"
import Owl from "../images/owl.png"

export const Home = () => {

    return (
        <>
            <div className="container-fluid bg-dark vh-100 mx-0 text-white">
                <div className="row text-center pt-2">
                    <div className="col">
                        <img src={Owl} alt="Owl Head" />
                    </div>
                </div>
                <div className="row text-center fs-2">
                    <div className="col mb-5">
                        <h1 className="courgette-regular">OwlGuide</h1>
                    </div>
                </div>
                <div className="d-grid gap-2 px-5 mt-5">
                    <Link to="/buying" className="btn btn-secondary" type="button">
                        Buying Decision
                    </Link>
                    <Link to="/enrollment" className="btn btn-secondary" type="button">
                        Enrollment
                    </Link>
                    <Link to="/" className="btn btn-secondary" type="button">
                        Eliminate Raf
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    )
}
