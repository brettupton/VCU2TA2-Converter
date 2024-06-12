export const Footer = ({ store, handleStoreChange }) => {
    return (
        <footer class="text-white fixed-bottom">
            <div className="container mx-0 px-0">
                <div className="row justify-content-between">
                    <div className="col-2">
                        <div className="dropdown">
                            <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {store}
                            </button>
                            <ul className="dropdown-menu text-center">
                                <li onClick={handleStoreChange} value={620}><button className="border-0 bg-white">620 - VCU</button></li>
                                <li onClick={handleStoreChange} value={622}><button className="border-0 bg-white">622 - MCV</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-1">

                    </div>
                </div>
            </div>
        </footer>
    )
}