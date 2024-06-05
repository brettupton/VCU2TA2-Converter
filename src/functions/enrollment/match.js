

const matchUserOfferings = (enroll, offering) => {
    const courses = []

    enroll.forEach(course => {
        const CRN = course["CRN"]
        if (offering[CRN]) {
            course["Offering_Num"] = offering[CRN];
        }

        courses.push(course)
    })
    return courses
}

module.exports = matchUserOfferings
