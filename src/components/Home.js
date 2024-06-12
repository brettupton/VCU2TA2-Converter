import { Footer } from "./Footer"
import { Link } from "react-router-dom"
import Owl from "../media/owl.png"
import sound from "../media/pizzapizza.wav"
import { useEffect, useState } from "react"

export const Home = () => {
    const [isDev, setIsDev] = useState(false)
    const [store, setStore] = useState(0)

    useEffect(() => {
        window.ipcRenderer.send('dev-check')
    }, [])

    const audio = new Audio(sound)
    const playAudio = () => {
        audio.play()
    }

    const handleStoreChange = (e) => {
        const { value } = e.currentTarget

        setStore(value)
    }

    window.ipcRenderer.on('is-dev', (event, data) => {
        setIsDev(data.isDev)
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
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Store
                    </button>
                    <ul className="dropdown-menu text-center">
                        <li onClick={handleStoreChange} value={620}><button className="border-0 bg-white">620 - VCU</button></li>
                        <li onClick={handleStoreChange} value={622}><button className="border-0 bg-white">622 - MCV</button></li>
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
                                <Link to="/" type="button" className="btn btn-secondary mb-3">Summon Decision</Link>
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
