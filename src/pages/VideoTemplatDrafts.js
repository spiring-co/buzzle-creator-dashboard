import React, { useEffect, useState } from "react"
import { Container, Typography, Paper, Button, Box } from "@material-ui/core"
export default () => {
    const [templates, setTemplates] = useState([])
    useEffect(() => {
        const temp = localStorage.getItem('draftTemplates')
        setTemplates(temp ? JSON.parse(temp) : [])
    }, [])
    const handleDelete = (index) => {
        const temp = templates.filter((item, ix) => index !== ix)
        setTemplates(temp)
        localStorage.setItem('draftTemplates', JSON.stringify(temp))
    }
    return (<Container>
        <Typography
            variant="h5">
            Drafted Templates
        </Typography>
        {templates.length ?
            templates.map(({ title, draftedAt }, index) =>
                <Paper style={{ marginTop: 10, padding: 10 }}>
                    <Typography variant="h6">
                        {title}
                    </Typography>
                    <Typography
                        color="secondary">
                        {new Date(draftedAt).toLocaleString()}
                    </Typography>
                    <Box style={{ marginTop: 10 }}>
                        <Button
                            onClick={() => alert("Edit Not done yet")}
                            children="EDIT" size="small" color="primary" variant="contained" />
                        <Button
                            onClick={() => handleDelete(index)}
                            children="Delete" size="small" color="secondary" />
                    </Box>
                </Paper>)
            : <Typography color="secondary">
                No Drafted Template</Typography>}
    </Container>)
}