import { useEffect, useState, useContext } from "react"
import { Footer } from "./Footer"
import { Link } from "react-router-dom"
import { StoreContext } from "../index"
import Owl from "../assets/media/owl.png"
import sound from "../assets/media/pizzapizza.wav"

export const Home = () => {
    const [isDev, setIsDev] = useState(false)
    const { store, handleStoreChange } = useContext(StoreContext)

    useEffect(() => {
        window.ipcRenderer.send('dev-check')
        window.ipcRenderer.send('store-check')
    }, [])

    useEffect(() => {
        if (store > 0) {
            window.ipcRenderer.send('store-change', { store: store })
        }
    }, [store])

    const audio = new Audio(sound)
    const playAudio = () => {
        audio.play()
    }

    window.ipcRenderer.on('is-dev', (event, data) => {
        setIsDev(data.isDev)
    })

    window.ipcRenderer.on('store-found', (event, data) => {
        handleStoreChange(data.store)
    })

    return (
        <div className="container-fluid bg-dark vh-100 mx-0 text-white">
            <div className="row text-center pt-4">
                <div className="col">
                    <img src={Owl} alt="Owl Head" />
                </div>
            </div>
            <div className="row text-center fs-2">
                <div className="col mb-5">
                    <h1 className="courgette-regular">OwlGuide</h1>
                </div>
            </div>
            {store === 0 &&
                <div className="text-center dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Store
                    </button>
                    <ul className="dropdown-menu text-center">
                        <li onClick={() => handleStoreChange(620)}><button className="border-0 bg-white">620 - VCU</button></li>
                        <li onClick={() => handleStoreChange(622)}><button className="border-0 bg-white">622 - MCV</button></li>
                    </ul>
                </div>
            }
            {store > 0 &&
                <>
                    <div className="row text-center">
                        <div className="col">
                            <div className="btn-group-vertical" role="group" aria-label="Vertical button group">
                                <Link to="/buying" type="button" className="btn btn-secondary mb-3">Buying Decision</Link>
                                <Link to="/enrollment" type="button" className="btn btn-secondary mb-3">Enrollment</Link>
                                <Link to="/adoptions" type="button" className="btn btn-secondary mb-3">Adoptions</Link>
                                <button to="/" type="button" className="btn btn-secondary mb-3" onClick={playAudio}>Summon Caesar</button>
                                {isDev &&
                                    <Link to="/dev" type="button" className="btn btn-secondary mb-3">Dev</Link>
                                }
                            </div>
                        </div>
                    </div>
                    <Footer
                        store={store}
                        handleStoreChange={handleStoreChange} />
                </>
            }
        </div>
    )
}
