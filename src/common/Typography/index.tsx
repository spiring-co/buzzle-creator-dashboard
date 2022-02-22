import React from "react"
import { TypographyProps, Typography } from "@material-ui/core"
export const Heading = (props: TypographyProps) => {
    return <Typography {...props}
        style={{
            fontFamily: "Poppins",
            fontWeight: 600,

            ...(props.style || {})
        }} variant="h4" />
}
export const SubHeading = (props: TypographyProps) => {
    return <Typography {...props} style={{
        fontFamily: "Poppins",
        fontWeight: 600,
        ...(props.style || {})
    }} variant="h5" />
}
export const Text = (props: TypographyProps) => {
    return <Typography {...props} style={{
        fontFamily: "Poppins",
        fontSize: 16,
        fontWeight: 500,
        ...(props.style || {})
    }} />
}
export const SmallText = (props: TypographyProps) => {
    return <Typography {...props} style={{
        fontSize: 14, fontWeight: 500,
        fontFamily: "Poppins",
        ...(props.style || {})
    }} />
}
export const ExtraSmallText = (props: TypographyProps) => {
    return <Typography {...props} style={{
        fontSize: 12,
        fontFamily: "Poppins", fontWeight: 500,
        ...(props.style || {})
    }}
        variant="subtitle1" />
}

