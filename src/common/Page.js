import React, { useEffect } from "react"

export default ({ component: Component, title }) => {

    useEffect(() => {
        document.title = title
    }, [title])

    return <Component />
}
