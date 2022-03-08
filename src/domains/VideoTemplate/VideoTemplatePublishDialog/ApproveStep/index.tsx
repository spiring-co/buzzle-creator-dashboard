import { Box, Button, Table, Card, TableBody, TableHead, TableCell, TextField, TableRow, InputAdornment, TableContainer, Container, CircularProgress } from "@material-ui/core"
import AlertHandler from "common/AlertHandler";
import { SmallText, Text } from "common/Typography";
import formatTime from "helpers/formatTime";
import { useSnackbar } from "notistack";
import React, { useState } from "react"
import { useAPI } from "services/APIContext";
import { useAuth } from "services/auth";
import { Pricing, VideoTemplate } from 'services/buzzle-sdk/types';
import { useConfig } from "services/RemoteConfigContext";

type IProps = {
    onSubmit: (data: VideoTemplate) => void,
    data: VideoTemplate,
    pricing: Array<Pricing>
}
export default ({ onSubmit, data, pricing }: IProps) => {
    const { user } = useAuth()
    const { VideoTemplate } = useAPI()
    const { enqueueSnackbar } = useSnackbar()
    const [loading, setLoading] = useState<"reject" | "publish" | "">("")
    const { createrLoyaltyPercentageShareValue } = useConfig()
    const [rejectReason, setRejectReason] = useState<string>("")
    const handleSubmit = async (state: "reject" | "publish") => {
        try {
            setLoading(state)
            const updated = await VideoTemplate.update(data?.id || "", {
                ...(state === "publish" ? { publishState: 'published', rejectionReason: "" } : { publishState: 'rejected', rejectionReason: rejectReason })
            })
            onSubmit(updated?.data)
            setLoading("")
        } catch (err) {
            setLoading("")
            enqueueSnackbar(`Failed to ${state}, due to ${(err as Error)?.message}`, {
                variant: 'error'
            })
        }
    }
    return <Box style={{ padding: 15, marginLeft: 15, marginRight: 15 }}>
        {data?.rejectionReason && data.publishState === "rejected" ? <AlertHandler
            title="Previous Rejection Reason"
            severity="error" message={data?.rejectionReason} /> : <div />}
        <Card style={{ marginTop: 15, marginBottom: 15 }} variant="outlined">
            <Table size="small" >
                <TableHead>
                    <TableRow>
                        {["Version Title",
                            "Avg. Time(HD)",
                            "Avg. Time(Full HD)",
                            "Loyalty Amount in USD",
                            "Creators Profit",
                            "Buzzle Profit"]?.map((title) =>
                                <TableCell><Text style={{ fontWeight: 600 }}>{title}</Text></TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.versions?.map((version) => {
                        const priceAndTimeForThiVersion = pricing?.find(({ idVersion }) => version?.id === idVersion)
                        return (<TableRow key={version?.title}>
                            <TableCell>
                                <SmallText>{version?.title}</SmallText>
                            </TableCell>
                            <TableCell>
                                <SmallText>{(formatTime(priceAndTimeForThiVersion?.half?.render?.averageTime ?? 0)) || "NA"}</SmallText>
                            </TableCell>
                            <TableCell>
                                <SmallText>{(formatTime(priceAndTimeForThiVersion?.full?.render?.averageTime ?? 0)) || "NA"}</SmallText>
                            </TableCell>
                            <TableCell>
                                <SmallText>{version?.loyaltyValue} {version?.loyaltyCurrency || "USD"}</SmallText>
                            </TableCell>
                            <TableCell><SmallText>{((version?.loyaltyValue ?? 0) * ((100 - createrLoyaltyPercentageShareValue) / 100)).toFixed(2)} {"USD"}</SmallText></TableCell>
                            <TableCell><SmallText>{((version?.loyaltyValue ?? 0) * (createrLoyaltyPercentageShareValue / 100)).toFixed(2)} {"USD"}</SmallText></TableCell>
                        </TableRow>)
                    })}
                </TableBody>
            </Table>
        </Card>
        <TextField value={rejectReason}
            fullWidth={true}
            variant="filled"
            label="Rejection Reason (If any)"
            placeholder="Enter rejection reason for template"
            onChange={e => setRejectReason(e.target.value)} />
        <Box style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
            <Button
                disabled={!!loading || !rejectReason}
                onClick={() => handleSubmit('reject')}
                style={{ marginTop: 10, marginRight: 10 }}
                size="small"
                color="secondary"
                children={loading === "reject" ? <CircularProgress color="inherit" size={20} /> : "Reject"}
                variant="contained"
            />
            <Button
                disabled={!!loading}
                style={{ marginTop: 10, }}
                size="small"
                color="primary"
                variant="contained"
                onClick={() => handleSubmit('publish')}
                children={loading === "publish" ? <CircularProgress color="inherit" size={20} /> : "Approve"}
            />
        </Box>
    </Box>
}