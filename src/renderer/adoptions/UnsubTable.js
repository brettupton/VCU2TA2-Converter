import { Fragment } from "react"
import { MatchRow } from "./MatchRow"
import { MatchRowNoText } from "./MatchRowNoText"

export const UnsubTable = ({ matchedAdoptions, adoptionSelection, handleAdoptionChange }) => {
    const keysArr = Object.keys(matchedAdoptions)

    return (
        <>
            <div className="row justify-content-between">
                <div className="col">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" id="All" value="all" checked={adoptionSelection === "all"} onChange={handleAdoptionChange} />
                        <label className="form-check-label" htmlFor="All">All</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" id="No-Text" value="ntr" checked={adoptionSelection === "ntr"} onChange={handleAdoptionChange} />
                        <label className="form-check-label" htmlFor="No-Text">No Text Required</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" id="No-Prev" value="npa" disabled />
                        <label className="form-check-label" htmlFor="No-Prev">No Prev Adoptions</label>
                    </div>
                </div>
                <div className="col-2">
                    {keysArr.length} unsubmitted courses
                </div>
            </div>
            <div className="row">
                <div className="col mx-auto">
                    <div className="table-responsive rounded"
                        style={{ height: "85vh", overflowY: 'auto' }}>
                        <table className="table table-bordered table-dark table-striped table-hover p-0">
                            <thead className="sticky-top p-0 table-light">
                                <tr className="align-middle" style={{ "border": 0 }}>
                                    <th className="border-0">Course</th>
                                    <th className="border-0">Title</th>
                                    <th className="border-0">Professor</th>
                                    <th className="border-0">F22 Prof</th>
                                    <th className="border-0">F23 Prof</th>
                                    <th className="border-0">F22</th>
                                    <th className="border-0">F23</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adoptionSelection === 'all' &&
                                    <MatchRow matchedAdoptions={matchedAdoptions} />
                                }
                                {adoptionSelection === 'ntr' &&
                                    <MatchRowNoText matchedAdoptions={matchedAdoptions} />
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}