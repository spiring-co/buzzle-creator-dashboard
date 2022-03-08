import { Box, Button, Table, Card, TableBody, TableHead, TableCell, TextField, TableRow, InputAdornment, TableContainer, Container, CircularProgress } from "@material-ui/core"
import { SmallText, Text } from "common/Typography";
import { useSnackbar } from "notistack";
import React, { useState } from "react"
import { useAPI } from "services/APIContext";
import { useAuth } from "services/auth";
import { VideoTemplate } from 'services/buzzle-sdk/types';
import { useConfig } from "services/RemoteConfigContext";

type IProps = {
    onBackPress: () => void,
    handlePublish: (data: VideoTemplate) => void,
    data: VideoTemplate
}
export default ({ onBackPress, handlePublish, data: defaultValue }: IProps) => {
    const { user } = useAuth()
    const { VideoTemplate } = useAPI()
    const { enqueueSnackbar } = useSnackbar()
    const [loading, setLoading] = useState<boolean>(false)
    const { createrLoyaltyPercentageShareValue } = useConfig()
    const [data, setData] = useState<VideoTemplate>(defaultValue)
    const handleSubmit = async () => {
        try {
            setLoading(true)
            const updated= await VideoTemplate.update(data?.id || "", data, { publishAction: "publish" })
            handlePublish(updated?.data)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            enqueueSnackbar(`Failed to publish, due to ${(err as Error)?.message}`, {
                variant: 'error'
            })
        }
    }
    return <Container>
        <Card style={{ marginTop: 15, marginBottom: 15 }} variant="outlined">
            <Table size="small" >
                <TableHead>
                    <TableRow>
                        {["Version Title", "Loyalty Amount in USD", user?.role === "admin" ? "Creator get" : "You Get", "We get"]?.map((title) =>
                            <TableCell><Text style={{ fontWeight: 600 }}>{title}</Text></TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.versions?.map((version) => <TableRow key={version?.title}>
                        <TableCell>
                            <SmallText>{version?.title}</SmallText>
                        </TableCell>
                        <TableCell>
                            <TextField
                                size="small"
                                margin="dense"
                                variant="filled"
                                label="Loyalty Amount in USD"
                                inputProps={{
                                    type: 'number',
                                }}
                                onChange={(e) => {
                                    e.persist();
                                    console.log(e?.target?.value)
                                    setData(data => ({
                                        ...data,
                                        versions: data?.versions?.map((vItem) => {
                                            if (vItem.id === version?.id) {
                                                return {
                                                    ...vItem, loyaltyCurrency: 'USD',
                                                    loyaltyValue: e?.target?.value ? parseInt(`${e?.target?.value || 0}`) : undefined
                                                }
                                            } else return vItem
                                        })
                                    }))
                                }}
                                placeholder={"Enter Amount in USD"}
                                value={version?.loyaltyValue ? version?.loyaltyValue : undefined}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                            />
                        </TableCell>
                        <TableCell><SmallText>{((version?.loyaltyValue ?? 0) * ((100 - createrLoyaltyPercentageShareValue) / 100)).toFixed(2)} {"USD"}</SmallText></TableCell>
                        <TableCell><SmallText>{((version?.loyaltyValue ?? 0) * (createrLoyaltyPercentageShareValue / 100)).toFixed(2)} {"USD"}</SmallText></TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </Card >
        <Box style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
            <Button
                disabled={loading}
                onClick={onBackPress}
                style={{ marginTop: 10, marginRight: 10 }}
                size="small"
                children="back"
            />
            <Button
                disabled={!data?.versions?.every(
                    ({ loyaltyValue = null }) =>
                        loyaltyValue !== null && !!loyaltyValue
                ) || loading}
                style={{ marginTop: 10, }}
                size="small"
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                children={loading ? <CircularProgress color="inherit" size={20} /> : "Submit"}
            />
        </Box>
    </Container>
}