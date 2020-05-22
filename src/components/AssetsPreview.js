import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Paper } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    container: {
        padding: 20,
    },
    assetsContainer: {
        display: 'flex',

        marginTop: 10,
    },
    layerName: { fontWeight: 'bold' },
    asset: {
        textAlign: 'center',
        margin: 5
    }
}))

const RenderAsset = ({ assetType, layerName, property, value, src }) => {
    const classes = useStyles()
    switch (assetType) {
        case 'data':
            return (<>
                <div className={classes.asset}>
                    <Typography className={classes.layerName}>Layer Name</Typography>
                    <p >{layerName}</p>
                </div>
                <div className={classes.asset}>
                    <Typography className={classes.layerName}>Property</Typography>
                    <p>{property}</p>
                </div>
                <div className={classes.asset}>
                    <Typography className={classes.layerName}>Value</Typography>
                    <p>{value}</p>
                </div>
            </>)
        case 'image':
            return (<>
                <div className={classes.asset}>
                    <Typography className={classes.layerName}>Layer Name</Typography>
                    <p >{layerName}</p>
                </div>
                <div className={classes.asset}>
                    <Typography className={classes.layerName}>Property</Typography>
                    <img
                        style={{ height: 100, width: 100 }}
                        src={src} />
                </div>
                <div className={classes.asset}>
                    <Typography className={classes.layerName}>Value</Typography>
                    <img
                        style={{ height: 100, width: 100 }}
                        src={src} />
                </div>
            </>)
        case 'audio':
            return (<>
                <div className={classes.asset}>
                    <Typography className={classes.layerName}>Layer Name</Typography>
                    <p >{layerName}</p>
                </div>
                <div className={classes.asset}>
                    <Typography className={classes.layerName}>Property</Typography>
                    <audio controls>
                        <source
                            src={src} />
                    </audio>
                </div>
                <div className={classes.asset}>
                    <Typography className={classes.layerName}>Value</Typography>

                    <audio controls>
                        <source
                            src={src} />
                    </audio>
                </div>
            </>)
        default:
            return <div />

    }
}

export default (props) => {
    const classes = useStyles()
    return (<div className={classes.assetsContainer}>
        <RenderAsset {...props} />
    </div>)
}