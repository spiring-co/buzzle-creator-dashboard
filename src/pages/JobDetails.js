import React from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
    container: {

    }
}))

export default () => {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            <Typography>HEllo</Typography>
        </div>
    )
}

