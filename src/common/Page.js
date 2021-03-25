import React, { useEffect } from "react"

export default ({ component: Component, title, props }) => {

    useEffect(() => {
        document.title = title
    }, [title])

    return <Component {...props} />
}
