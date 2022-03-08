import { Box, Button, Table, Card, TableBody, TableHead, TableCell, TextField, TableRow, InputAdornment, TableContainer, Container, CircularProgress } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { VideoTemplate, Pricing, VersionInterface } from "services/buzzle-sdk/types"
import { useConfig } from "services/RemoteConfigContext"
import formatTime from "helpers/formatTime";
import { TestJobVersionsParams } from "common/types";
import createTestJobs from "helpers/createTestJobs";
import { useAPI } from "services/APIContext";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

type IProps = {
    handleSubmit: () => void,
    data: VideoTemplate,
    pricing: Array<Pricing>

}
export default ({ handleSubmit, data, pricing }: IProps) => {
    const { Job } = useAPI()
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()
    const [loading, setLoading] = useState<boolean>(false)
    const handleRenderJob = async () => {
        //get
        const testJobs: TestJobVersionsParams = pricing.map(({ half, full, idVersion }) =>
            [...!half?.render?.averageTime ? [{
                ...(data?.versions?.find(({ id }) => id === idVersion) || {} as VersionInterface),
                id: idVersion, settingsTemplate: "half", dataFillType: "maxLength"
            }] : [],
            ...!full?.render?.averageTime ? [{
                ...(data?.versions?.find(({ id }) => id === idVersion) || {} as VersionInterface),
                id: idVersion, settingsTemplate: "full",
                dataFillType: "maxLength"
            }] : []]).flat()
        try {
            setLoading(true)
            await Promise.all(createTestJobs(data?.id || "", testJobs)
                ?.map(async (data) => await Job.create(data)))
            history.push("/home/jobs", {
                message: "Video renders created successfully, Once finished you can continue to publish the template section."
            })
            setLoading(false)
        } catch (err) {
            setLoading(false)
            enqueueSnackbar((err as Error)?.message || "Failed to create renders, Please Try later", {
                variant: 'error'
            })
        }

    }
    const isAllVersionHasRenderTime = pricing.every(({ half, full }) => half?.render?.averageTime && full?.render?.averageTime)
    return <Container>
        <Card style={{ margin: 15 }} variant="outlined">
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell><b>Version Name</b></TableCell>
                        <TableCell><b>Avg. Render Time (HD)</b></TableCell>
                        <TableCell><b>Avg. Render Time (Full HD)</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.versions?.map(
                        ({ id, title, averageRenderTime = "" }) => {
                            const priceAndTimeForThiVersion = pricing?.find(({ idVersion }) => id === idVersion)
                            return (
                                <TableRow key={id}>
                                    <TableCell>{title}</TableCell>
                                    <TableCell>
                                        {(formatTime(priceAndTimeForThiVersion?.half?.render?.averageTime ?? 0)) || "NA"}
                                    </TableCell>
                                    <TableCell>
                                        {(formatTime(priceAndTimeForThiVersion?.full?.render?.averageTime ?? 0)) || "NA"}
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    )}
                </TableBody>
            </Table>
        </Card>
        <Box style={{ display: 'flex', alignItems: 'center', margin: 15 }}>
            <Button
                disabled={isAllVersionHasRenderTime || loading}
                onClick={handleRenderJob}
                style={{ marginTop: 10, marginRight: 10 }}
                color="primary"
                variant="contained"
                size="small"
                children={loading ? <CircularProgress color="inherit" size={20} /> : "Render"}
            />
            <Button
                disabled={!isAllVersionHasRenderTime}
                style={{ marginTop: 10, }}
                size="small"
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                children="Next"
            />
        </Box>
    </Container>
}