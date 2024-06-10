const prevFallAdoptions = require('../../Ωcourses/F22F23.json')

const unsubmittedAdoptions = (fullAdoptions) => {
    const notSubmitted = {}

    Object.entries(fullAdoptions).forEach(
        ([key, value]) => {
            if (value["Status"] === "Not Submitted") {
                notSubmitted[key] = value
            }
        }
    )

    return notSubmitted
}

const matchPrevAdoptions = (fullAdoptions, term) => {
    const unsubmitted = unsubmittedAdoptions(fullAdoptions)
    const matchedCourses = {}

    switch (term) {
        case "Fall":
            Object.entries(unsubmitted).forEach(
                ([key, value]) => {
                    if (prevFallAdoptions[key]) {
                        const matchedCourse = prevFallAdoptions[key]
                        matchedCourses[key] = {
                            Title: value["Title"],
                            Professor: value["Professor"],
                            F22: matchedCourse["F22"] || {},
                            F23: matchedCourse["F23"] || {}
                        }
                    } else {
                        matchedCourses[key] = {
                            Title: value["Title"],
                            Professor: value["Professor"],
                            F22: {},
                            F23: {}
                        }
                    }
                }
            )
            break
        default:
            break
    }

    return matchedCourses
}

module.exports = matchPrevAdoptions