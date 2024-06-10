import { Fragment } from "react"

export const MatchRow = ({ matchedAdoptions }) => {
    const keysArr = Object.keys(matchedAdoptions)

    return (
        keysArr.map((course, key) => {
            const currCourse = matchedAdoptions[course]
            return (
                <tr key={key}>
                    <td style={{ width: "140px" }}>{course}</td>
                    <td>{currCourse["Title"]}</td>
                    <td>{currCourse["Professor"]}</td>
                    <td>{(currCourse["F22"]["Professor"]) ? currCourse["F22"]["Professor"] : ""}</td>
                    <td>{(currCourse["F23"]["Professor"]) ? currCourse["F23"]["Professor"] : ""}</td>
                    <td>
                        {currCourse["F22"]["Adoptions"] &&
                            currCourse["F22"]["Adoptions"].map((book, key) => (
                                <Fragment key={key}>
                                    <span style={
                                        {
                                            maxWidth: "420px",
                                            display: "inline-block",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}>
                                        {book["ISBN"]} - {book["Title"]}
                                    </span>
                                    {key !== currCourse["F22"]["Adoptions"].length - 1 && <br />}
                                </Fragment>
                            ))}
                    </td>
                    <td>
                        {currCourse["F23"]["Adoptions"] &&
                            currCourse["F23"]["Adoptions"].map((book, key) => (
                                <Fragment key={key}>
                                    <span style={
                                        {
                                            maxWidth: "420px",
                                            display: "inline-block",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}>
                                        {book["ISBN"]} - {book["Title"]}
                                    </span>
                                    {key !== currCourse["F23"]["Adoptions"].length - 1 && <br />}
                                </Fragment>
                            ))}
                    </td>
                </tr>
            )
        }
        )
    )
}