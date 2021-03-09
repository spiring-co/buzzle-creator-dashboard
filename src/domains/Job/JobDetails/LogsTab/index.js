
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default ({ logs: data }) => {
    const [loading, setLoading] = useState(true)
    const [logs, setLogs] = useState(data)
    useEffect(() => {
        Promise.all(data.map(async l => ({ ...l, text: await getFileText(l?.text) })))
            .then((d) => setLogs(d))
            .catch((err) => console.log(err)).finally(() => setLoading(false))
    }, [data])
    const getFileText = async (url) => {
        return (await (await fetch(url))?.text())
    }
    const logColors = {
        warning: "yellow",
        info: "#fff",
        error: "red",

    }
    return <Box display="flex" flexDirection="column" px={8}>
        <h1>Logs here.</h1>
        {loading ? <p>loading...</p> : logs?.map((l, i) => (
            <Accordion key={i}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Typography>{l.label.toUpperCase()}</Typography>
                    <Typography color="textSecondary" style={{ marginLeft: 30 }}>
                        {new Date(l?.updatedAt).toLocaleString()}
                    </Typography>
                    <Typography color="textSecondary" style={{ marginLeft: 30 }}>
                        Instance Id: {l?.rendererInstance?.instanceId}, IPV4: {l?.rendererInstance?.ipv4}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div
                        style={{
                            display: "flex",
                            backgroundColor: "black", paddingBottom: 100, padding: 10, flexDirection: 'column', width: '100%',
                        }}>
                        {l.label === 'console' ?
                            <>
                                {JSON.parse(l?.text)?.map(({ line, data, level, timestamp = new Date().toLocaleString() }) =>
                                    <Box style={{ display: 'flex' }}>
                                        <code
                                            style={{
                                                "white-space": "pre-line",
                                                fontSize: 14,
                                                fontFamily: "monospace",
                                                fontWeight: 600, color: '#fff',
                                                paddingRight: 10,
                                                textAlign: 'right',
                                                minWidth: 40,
                                                "border-right": "0.2px solid #fff"
                                            }}>
                                            {`${line}`}
                                        </code>
                                        <code
                                            style={{
                                                "white-space": "pre-line",
                                                paddingLeft: 35,
                                                fontSize: 14,
                                                fontFamily: "monospace",
                                                fontWeight: 600, color: logColors[level]
                                            }}>
                                            {timestamp}: {data?.toString()?.replace(/,/g, "\n")}
                                        </code>
                                    </Box>)}
                            </>
                            : <code style={{
                                "white-space": "pre-line",
                                paddingLeft: 35,
                                fontSize: 14,
                                fontFamily: "monospace",
                                fontWeight: 600, color: '#fff'
                            }}>
                                {l.text}
                            </code>}
                    </div>
                </AccordionDetails>
            </Accordion>
        ))}
    </Box>
}