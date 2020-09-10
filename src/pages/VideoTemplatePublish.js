import React, { useState, useEffect } from "react";
import {
    Button,
    FormControl, Select, FormHelperText, MenuItem, InputLabel,
    LinearProgress, Box, InputAdornment, Popover,
    Paper, Container, IconButton,
    Typography, TextField,
    withStyles,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { apiClient } from "buzzle-sdk";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import useApi from "services/apiHook";
import PublishSteps from "../components/PublishSteps"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { countryCodes, currencies } from '../helpers/Currencies';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useCurrency } from "services/currencyContext";
import createTestJobs from "helpers/createTestJobs";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const { Job } = apiClient({
    baseUrl: process.env.REACT_APP_API_URL,
    authToken: localStorage.getItem("jwtoken"),
});
const { VideoTemplate } = apiClient({
    baseUrl: process.env.REACT_APP_API_URL,
    authToken: localStorage.getItem("jwtoken"),
});
const CustomProgress = withStyles({
    colorPrimary: {
        backgroundColor: "#b2dfdb",
    },
    barColorPrimary: {
        backgroundColor: "#00695c",
    },
})(LinearProgress);

export default ({ location }) => {
    const { url } = useRouteMatch();
    const { id } = useParams();
    const { data = {}, loading, err } = useApi(
        `${process.env.REACT_APP_API_URL}/videoTemplates/${id}`
    );
    const history = useHistory();
    const { currency } = useCurrency()
    const [anchorEl, setAnchorEl] = useState(null)
    const [videoTemplate, setVideoTemplate] = useState(data)
    const [isPublishing, setIsPublishing] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null);
    const [activeStep, setActiveStep] = useState(0)
    const open = Boolean(anchorEl);
    const idPopover = open ? 'simple-popover' : undefined;
    useEffect(() => {
        setVideoTemplate(data)
        console.log(data)
    }, [data])

    const handleRenderTestJob = async (versionId) => {
        // render test job for version 
        setIsLoading(true)
        const job = await createTestJobs(id, {
            versions: videoTemplate?.versions?.map(({ averageRenderTime = "" }) => averageRenderTime),
            dataFillType: "maxLength",
            incrementFrame: 1,
            renderSettings: "h264",
            settingsTemplate: "half",
        });
        await Job.create(job)
        setIsLoading(false)

        history.push("/home/jobs");
    }


    const handlePublish = async () => {
        try {
            setIsPublishing(true)
            //update template with isPublished to true, loyalityCost and loyalty Currency
            await VideoTemplate.update(id, videoTemplate)
            setIsPublishing(false)
            history.push({
                pathname: "/home/videoTemplates",
                state: {
                    statusObj: {
                        status: {
                            message: `Published Successfully.`,
                        },
                        err: false,
                    },
                },
            });
        } catch (err) {
            setError(err)
            setIsPublishing(false)
        }
    };
    const handleCurrencyChange = ({ target: { value } }) => {
        setVideoTemplate({ ...videoTemplate, versions: videoTemplate?.versions?.map(item => ({ ...item, loyaltyCurrency: value, loyaltyValue: null })) })
    }
    const handleLoyaltySet = (versionIndex, amount) => {
        setVideoTemplate({
            ...videoTemplate,
            publishState: 'pending',
            versions: videoTemplate?.versions?.map((item, index) =>
                index === versionIndex
                    ? ({ ...item, loyaltyValue: amount })
                    : item)
        })
    }
    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);

    const StyledTableRow = withStyles((theme) => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }))(TableRow);
    if (err) setError(err);
    const renderStep = (activeStep) => {
        switch (activeStep) {
            case 0:
                return (<TableContainer>
                    <Table size="small" aria-label="a dense table">
                        <caption>Render Time is required for calculating Loyalty Amount, If NA?, Render a Test Job and try after completion</caption>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Version Name</StyledTableCell>
                                <StyledTableCell >Average Render Time</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {videoTemplate?.versions?.map(({ id, title, averageRenderTime = "" }) => (
                                <StyledTableRow key={id}>
                                    <StyledTableCell >
                                        {title}
                                    </StyledTableCell>
                                    <StyledTableCell >{averageRenderTime == 0 || !averageRenderTime ? 'NA' : `${averageRenderTime} ms`}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button
                        onClick={() => handleRenderTestJob(id)}
                        size="small"
                        children="Render Job"
                        variant="contained"
                        color="primary" />
                    <div>
                        <Button
                            disabled={!videoTemplate?.versions?.every(({ averageRenderTime = 0 }) => averageRenderTime != 0)}
                            size="small"
                            style={{ width: 'fit-content', marginTop: 10 }}
                            color="primary"
                            variant="contained"
                            onClick={() => setActiveStep(activeStep + 1)}
                            children="Next"
                        />
                    </div>
                </TableContainer>);
            case 1:
                return (<TableContainer>
                    <FormControl margin="dense" fullWidth variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">
                            Select your currency
              </InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            onChange={handleCurrencyChange}
                            value={videoTemplate?.versions[0]?.loyaltyCurrency ?? currency}
                            placeholder="Select your currency"
                            label="Select your currency">
                            {currencies.length === 0 && (
                                <MenuItem disabled={true}>No Currencies</MenuItem>
                            )}
                            {currencies.map((item, index) => {
                                return (
                                    <MenuItem key={item} id={index} value={item}>
                                        {item}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        {/* <FormHelperText>Lo</FormHelperText> */}
                    </FormControl>
                    <Table size="small" aria-label="a dense table">
                        <caption> <IconButton onClick={({ currentTarget }) => setAnchorEl(currentTarget)}>
                            <InfoOutlinedIcon /> </IconButton>we recommend you to set loyalty as per the platform most accepted loyalty value, click ⓘ button to see platofrm rates
                           </caption>
                        <TableHead>
                            <Popover
                                id={idPopover}
                                open={open}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                onClose={() => setAnchorEl(null)}
                            >
                                <Container style={{ padding: 15 }}>
                                    <Typography>Here comes platform rates</Typography>
                                </Container>
                            </Popover>
                            <StyledTableRow>
                                <StyledTableCell>Version Name</StyledTableCell>
                                <StyledTableCell >Loyalty amount for this version</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {videoTemplate?.versions?.map(({ id, title, loyaltyValue = null }, index) => (
                                <StyledTableRow >
                                    <StyledTableCell >
                                        {title}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <TextField
                                            style={{ background: '#fff' }}
                                            required
                                            variant="outlined"
                                            value={loyaltyValue}
                                            onChange={({ target: { value } }) => handleLoyaltySet(index, value)}
                                            type="number"
                                            margin="dense"
                                            placeholder="Enter loyalty value"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">{videoTemplate?.versions[0]?.loyaltyCurrency ?? currency}</InputAdornment>,
                                            }}
                                            label="Enter loyalty value"
                                        /></StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div>
                        <Button
                            onClick={() => setActiveStep(activeStep - 1)}
                            size="small"
                            style={{ width: 'fit-content', marginTop: 10 }}
                            children="back"
                        />
                        <Button
                            disabled={!videoTemplate?.versions?.every(({ loyaltyValue = null }) => (loyaltyValue !== null && loyaltyValue !== "")) || isPublishing}
                            size="small"
                            style={{ width: 'fit-content', marginTop: 10 }}
                            color="primary"
                            variant="contained"
                            onClick={handlePublish}
                            children={isPublishing ? "Publishing ..." : "Publish"}
                        />
                    </div>
                </TableContainer>);
            default:
                return;
        }
    };

    return (
        <Container>
            {loading || isPublishing || isLoading ? <CustomProgress /> : ""}
            {error && <Alert severity="error" children={`${error.message}`} />}
            <Container style={{ backgroundColor: 'white', padding: 10, marginBottom: 10 }}>
                <Typography variant="h5">
                    Publish Template
                </Typography>
            </Container>
            <PublishSteps activeStep={activeStep} renderStep={renderStep} />
        </Container>
    );
};
