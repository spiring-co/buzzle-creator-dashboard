import React from 'react'
import { Typography, Paper } from '@material-ui/core'
import AssetsPreview from 'components/AssetsPreview'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    container: {
        padding: 20,
    }
}))

export default (props) => {
    var { jobDetails } = props?.location?.state
    console.log(jobDetails.assets)
    var { output, state, assets } = jobDetails
    const classes = useStyles()
    return (
        <Paper className={classes.container}>
            <Typography variant="h4">Job Details</Typography>
            <Typography style={{ marginTop: 10, }} variant="h5">Status</Typography>
            <Typography
                style={{
                    color: state === 'finished' ? 'green'
                        : 'orange'
                }}>{state}</Typography>
            <Typography
                style={{ marginTop: 10, }} variant="h5">Output</Typography>
            {state === 'finished' ?
                <video
                    style={{
                        width: 320,
                        height: 220,
                        marginTop: 10
                    }} controls
                    src={output}
                /> : <Typography style={{ color: 'grey' }}>No Output Yet</Typography>}

            <Typography style={{ marginTop: 10, }} variant="h5">Assets</Typography>

            {assets.map((props) => {
                return (<AssetsPreview {...props} />)
            })}
        </Paper>
    )
}

