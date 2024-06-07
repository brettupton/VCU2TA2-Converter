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

module.exports = unsubmittedAdoptions