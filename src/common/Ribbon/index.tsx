import { Box } from '@material-ui/core'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import { Text } from 'common/Typography'
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import React from 'react'
type IProps = {
    text: string,
    style?: React.CSSProperties,
    textStyle?: React.CSSProperties,
    type?: 'upper' | 'lower',
    variant: "error" | "success" | "warning" | 'info'
}
export default ({ text, style = {}, textStyle = {}, type = "lower", variant }: IProps) => {
    const variants = {
        "error": {
            background: "#d32f2f", text: "#fff", secondary: '#871b1b',
            icon: <InfoOutlinedIcon style={{ color: "#fff", paddingLeft: 5, paddingRight: 5 }} fontSize={"inherit"} />

        },
        "info": {
            background: "#2196f3", text: "#fff", secondary: '#1b4667',
            icon: <InfoOutlinedIcon style={{ color: "#fff", paddingLeft: 5, paddingRight: 5 }} fontSize={"inherit"} />
        },
        "warning": {
            background: "#ffc372", text: "#663c00", secondary: '#b68749',
            icon: <ReportProblemOutlinedIcon style={{ color: "#663c00", paddingLeft: 5, paddingRight: 5 }} fontSize={"inherit"} />

        },
        "success": {
            background: "#8bc34a", text: "#fff", secondary: '#507129',
            icon: <CheckCircleOutlineOutlinedIcon style={{ color: "#fff", paddingLeft: 5, paddingRight: 5 }} fontSize={"inherit"} />

        }
    }
    const styles = {
        upperRibon: {
            // justifyContent: 'center',
            fontSize:25,
            alignItems: 'center',
            display: 'flex',
            backgroundColor: variants[variant].background,//"#db2828",
            borderTopRightRadius: 3,
            borderBottomRightRadius: 3,
        },
        smallRibbon: {
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderWidth: 5,
            borderColor: 'transparent',
            borderTopColor: variants[variant].secondary,// '',
            borderRightColor: variants[variant].secondary,// '#b21e1e',
        },
        text: { color: variants[variant].text, padding: 5, fontSize: 12, marginBottom: 0, marginTop: 0 },

    }
    return <Box style={{ position: 'absolute', zIndex: 1, top: 5, left: 5, ...style }}>
        {type === 'upper' ? <Box
            style={{ ...styles.smallRibbon, transform: 'rotate(90deg)' }}
        /> : <Box />}
        <Box
            style={styles.upperRibon}>
            {variants[variant]?.icon}
            <Text style={{ ...styles.text, ...textStyle }}>{text}</Text>
        </Box>
        {type === 'lower' ? <Box
            style={{
                ...styles.smallRibbon,
            }}
        /> : <Box />}
    </Box>
}