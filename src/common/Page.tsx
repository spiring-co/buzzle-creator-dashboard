import React, { ReactNode, useEffect } from "react"
import { useAuth } from "services/auth"
type IProps = {
    component: any,
    props: any,
    title: string,
}
export default ({ component: Component, title, props }: IProps) => {
    useEffect(() => {
        document.title = `Buzzle${title ? ` | ${title}` : ""}`
    }, [title])
    return <Component {...props} />
}
