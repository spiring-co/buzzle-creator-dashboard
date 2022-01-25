import {
    Button, Paper,
    Typography, Box, IconButton, Container, Chip,
    Popover, Select, FormControl,
    MenuItem, InputLabel, MenuList, Divider, CircularProgress
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import TodayIcon from '@material-ui/icons/Today';
import moment from 'moment'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import ApexCharts from "react-apexcharts";
import { Job } from "services/api";
import { useSnackbar } from "notistack";

export default () => {
    const { enqueueSnackbar } = useSnackbar();
    const [date, setDate] = useState(
        {
            startDate: moment().startOf('d').toDate(),
            endDate: moment().endOf('d').toDate(),
            key: 'selection'
        }
    );
    const [loading, setLoading] = useState(false)
    const [selectedDuration, setSelectedDuration] = useState('day')
    const getCategories = (duration = selectedDuration) => {
        const categories = []
        switch (duration) {
            case "day":
                for (let index = moment(date.startDate); index.isBefore(moment(date.endDate).add(1, 's'), 's'); index.add(3, 'h')) {
                    categories.push({ from: index.toDate(), to: moment(index.toDate()).add(3, 'h').subtract(1, 's').toDate() })
                }
                return categories
            case "week":
                for (let index = moment(date.startDate); index.isBefore(moment(date.endDate).add(1, 's'), 's'); index.add(1, 'd')) {
                    categories.push({ from: index.startOf('d').toDate(), to: index.endOf('d').toDate() })
                }
                return categories
            case "month":
                for (let index = moment(date.startDate); index.isBefore(moment(date.endDate).add(1, 's'), 's'); index.add(1, 'd')) {
                    categories.push({ from: index.startOf('d').toDate(), to: index.endOf('d').toDate() })
                }
                return categories
            case "year":
                for (let index = moment(date.startDate); index.isBefore(moment(date.endDate).add(1, 's'), 's'); index.add(1, 'month')) {

                    categories.push({ from: index.startOf('month').toDate(), to: index.endOf('month').toDate() })
                }
                return categories
            case "custom":
                const noOfDays = (Math.round((moment(date.endDate).diff(moment(date.startDate), 'seconds') / 60) / 60)) / 24
                if (noOfDays <= 31) {
                    if (noOfDays <= 1) {
                        return getCategories('day')
                    }
                    else if (noOfDays <= 7) {
                        return getCategories('week')
                    } else {
                        return getCategories('month')
                    }
                } else {
                    for (let index = moment(date.startDate); index.isBefore(moment(date.endDate).add(1, 's'), 's'); index.add(7, 'd')) {
                        if (moment(index.toDate()).add(7, 'd').isBefore(moment(date.endDate).add(1, 's'), 's')) {
                            categories.push({ from: index.toDate(), to: moment(index.toDate()).add(7, 'd').subtract(1, 's').toDate() })
                        } else {
                            const noDaysDifference = (Math.round((moment(date.endDate).diff(index, 'seconds') / 60) / 60)) / 24
                            categories.push({ from: index.toDate(), to: moment(index.toDate()).add(noDaysDifference, 'd').subtract(1, 's').toDate() })
                        }
                    }
                    return categories
                }
            default:
                return []
        }
    }
    const [categories, setCategories] = useState(getCategories(selectedDuration))
    const [count, setCount] = useState(null)
    const [data, setData] = useState(null)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [mode, setMode] = useState('template')
    const durations = [
        'day',
        'week',
        'month',
        'custom'
    ]
    //'year',

    const fetchJobs = async () => {
        try {
            const categ = getCategories(selectedDuration)
            setCategories(categ)
            setLoading(true)
            // const result = await Job.getAll(
            //     1,
            //     0,
            //     : "" `dateUpdated=>=${date.startDate.toISOString()}&${date.endDate ? `dateUpdated=<=${date.endDate.toISOString() || date.startDate.toISOString()}&`
            //     }`,
            //     'dateUpdated',
            //     'desc'
            // )
            let result = await fetch(`${process.env.REACT_APP_API_URL}/analytics?mode=${mode}&dateUpdated=>=${date.startDate.toISOString()}&${date.endDate ? `dateUpdated=<=${date.endDate.toISOString() || date.startDate.toISOString()}` : ""}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("jwtoken")}`,
                },
            })

            if (result.ok) {
                result = await result.json()
            } else {
                throw new Error((await result.json())?.message)
            }
            setCount(result?.count || [])
            let videoTemplateSeries = [...new Set(result?.data?.map(item => item.id))]
            setData(videoTemplateSeries.map((idVideoTemplate) => ({
                name: result?.data?.find(({ id }) => id === idVideoTemplate)?.title || "",
                data: categ.map(categoryDate => result?.data?.filter(({ id, date }) => id === idVideoTemplate
                    && moment(date).isBetween(moment(categoryDate?.from), moment(categoryDate?.to), 's', '[]')
                )?.length
                )
            })))
            setLoading(false)
        } catch (err) {
            setLoading(false)
            enqueueSnackbar(
                `${err?.message ?? "Something went wrong"}`,
                {
                    variant: "error",
                    action: () => <Button size="small" color="inherit" children="retry" onClick={fetchJobs} />
                }
            );
        }
    }
    useEffect(() => {
        if (!isDatePickerOpen) {
            fetchJobs()
        }
    }, [date, isDatePickerOpen])
    useEffect(() => {
        if (!anchorEl && isDatePickerOpen) {
            setIsDatePickerOpen(false)
        }
    }, [anchorEl, isDatePickerOpen])

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleSetToday = () => {
        setSelectedDuration('day')
        setDate({
            startDate: moment().startOf('d').toDate(),
            endDate: moment().endOf('d').toDate(),
            key: 'selection'
        })
    }

    const handleNextDate = () => {
        switch (selectedDuration) {
            case 'custom':
                //calculate no of seconds between and add to endDate and  startDate
                const difference = moment(date.endDate).diff(moment(date.startDate), 'seconds')
                setDate({
                    startDate: moment(date.startDate).add(difference + 1, 'seconds').startOf("d").toDate(),
                    endDate: moment(date.endDate).add(difference, 'seconds').endOf("d").toDate(),
                    key: 'selection'
                })
                break;
            case 'day':
                setDate({
                    startDate: moment(date.endDate).add(1, 'd').startOf("d").toDate(),
                    endDate: moment(date.endDate).add(1, 'd').endOf("d").toDate(),
                    key: 'selection'
                })
                break;
            case 'week':
                setDate({
                    startDate: moment(date.endDate).add(1, 'd').startOf("week").toDate(),
                    endDate: moment(date.endDate).add(1, 'd').endOf("week").toDate(),
                    key: 'selection'
                })
                break;

            case 'month':

                setDate({
                    startDate: moment(date.endDate).add(1, 'd').startOf("month").toDate(),
                    endDate: moment(date.endDate).add(1, 'd').endOf("month").toDate(),
                    key: 'selection'
                })
                break;
            case 'year':

                setDate({
                    startDate: moment(date.endDate).add(1, 'd').startOf("year").toDate(),
                    endDate: moment(date.endDate).add(1, 'd').endOf("year").toDate(),
                    key: 'selection'
                })
                break;
            default:
                setDate({
                    startDate: moment().startOf('d').toDate(),
                    endDate: moment().endOf('d').toDate(),
                    key: 'selection'
                })
                break;
        }
    }



    const handlePreviousDate = () => {
        switch (selectedDuration) {
            case 'custom':
                //calculate no of seconds between and add to endDate and  startDate
                const difference = moment(date.endDate).diff(moment(date.startDate), 'seconds')
                setDate({
                    startDate: moment(date.startDate).subtract(difference, 'seconds').startOf("d").toDate(),
                    endDate: moment(date.endDate).subtract(difference + 1, 'seconds').endOf("d").toDate(),
                    key: 'selection'
                })
                break;
            case 'day':
                setDate({
                    startDate: moment(date.startDate).subtract(1, 'd').startOf("d").toDate(),
                    endDate: moment(date.startDate).subtract(1, 'd').endOf("d").toDate(),
                    key: 'selection'
                })
                break;
            case 'week':
                setDate({
                    startDate: moment(date.startDate).subtract(1, 'd').startOf("week").toDate(),
                    endDate: moment(date.startDate).subtract(1, 'd').endOf("week").toDate(),
                    key: 'selection'
                })
                break;

            case 'month':
                setDate({
                    startDate: moment(date.startDate).subtract(1, 'd').startOf("month").toDate(),
                    endDate: moment(date.startDate).subtract(1, 'd').endOf("month").toDate(),
                    key: 'selection'
                })
                break;

            case 'year':
                setDate({
                    startDate: moment(date.startDate).subtract(1, 'd').startOf("year").toDate(),
                    endDate: moment(date.startDate).subtract(1, 'd').endOf("year").toDate(),
                    key: 'selection'
                })
                break;
            default:
                break;
        }

    }
    const handleDurationSet = (duration) => {
        setSelectedDuration(duration)
        switch (duration) {
            case 'custom':
                setIsDatePickerOpen(true)
                break;
            case 'day':
                //if end Date is after current date set current date, else set end Date as date
                if (moment(date.endDate).endOf('d').isAfter(moment().endOf('d'))) {
                    handleSetToday()
                } else {
                    setDate({
                        startDate: moment(date.endDate).startOf("d").toDate(),
                        endDate: moment(date.endDate).endOf("d").toDate(),
                        key: 'selection'
                    })
                }

                handleClose()
                break;
            case 'week':
                setDate({
                    startDate: moment(date.startDate).startOf("w").toDate(),
                    endDate: moment(date.startDate).endOf("w").toDate(),
                    key: 'selection'
                })
                handleClose()
                break;

            case 'month':
                setDate({
                    startDate: moment(date.startDate).startOf("month").toDate(),
                    endDate: moment(date.startDate).endOf("month").toDate(),
                    key: 'selection'
                })
                handleClose()
                break;
            case 'year':
                setDate({
                    startDate: moment(date.startDate).startOf("year").toDate(),
                    endDate: moment(date.startDate).endOf("year").toDate(),
                    key: 'selection'
                })
                handleClose()
                break;
            default:
                setDate({
                    startDate: moment().startOf('d').toDate(),
                    endDate: moment().endOf('d').toDate(),
                    key: 'selection'
                })
                handleClose()
                break;
        }
    }
    const getXAxisLabel = (value) => {
        switch (selectedDuration) {
            case "day":
                return moment(value?.to).add(1, 's').format('LT')
            case "week":
                return moment(value?.to).format('ddd, DD MMM')
            case "month":
                return moment(value?.to).format('DD MMM')
            case "year":
                return moment(value?.to).format('MMM')
            case "custom":
                const noOfDays = (Math.round((moment(date.endDate).diff(moment(date.startDate), 'seconds') / 60) / 60)) / 24
                if (noOfDays <= 31) {
                    if (noOfDays <= 1) {
                        return moment(value?.to).add(1, 's').format('LT')
                    } else if (noOfDays <= 7) {
                        return moment(value?.to).format('ddd, DD MMM')
                    } else {
                        return moment(value?.to).format('DD MMM')
                    }
                } else {
                    return `${moment(value?.from).format('DD MMM')} - ${moment(value?.to).format('DD MMM')}`
                }
            default:
                return ""
        }
    }
    const getXAxisTitle = (value) => {
        switch (selectedDuration) {
            case "day":
                return `${moment(value?.from).format('LT')} - ${moment(value?.to).add(1, 's').format('LT')}`
            case "week":
                return `${moment(value?.to).format('ddd, DD MMM')}`
            case "month":
                return `${moment(value?.to).format('ddd, DD MMM')}`
            case "year":
                return moment(value?.to).format('MMM')
            case "custom":
                const noOfDays = (Math.round((moment(date.endDate).diff(moment(date.startDate), 'seconds') / 60) / 60)) / 24
                if (noOfDays <= 31) {
                    if (noOfDays <= 1) {
                        return `${moment(value?.from).format('LT')} - ${moment(value?.to).add(1, 's').format('LT')}`
                    }
                    else if (noOfDays <= 7) {
                        return `${moment(value?.to).format('ddd, DD MMM')}`
                    } else {
                        return `${moment(value?.to).format('ddd, DD MMM')}`
                    }
                } else {
                    return `${moment(value?.from).format('DD MMM')} - ${moment(value?.to).format('DD MMM')}`
                }
            default:
                return ""
        }

    }
    return (
        <Container>
            <Paper style={{ padding: 15, }}>
                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button onClick={handleSetToday} children="today" variant="outlined" />
                    <Box style={{ display: 'flex', alignItems: 'center', marginLeft: 15, marginRight: 15 }}>
                        <IconButton aria-label="previous" onClick={handlePreviousDate}>
                            <ArrowBackIosIcon fontSize="small" />
                        </IconButton>
                        <IconButton aria-label="next" onClick={handleNextDate}>
                            <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                        <Button
                            onClick={handleOpenMenu}
                            startIcon={<TodayIcon />}>
                            {moment(date.endDate).diff(moment(date.startDate), 'd') == 0 ? moment(date.startDate).format('LL') : `${moment(date.startDate).format('D MMM, YYYY')} - ${moment(date.endDate).format('D MMM, YYYY')}`}
                            <Chip style={{
                                fontSize: 9, height: 13,
                                marginLeft: 10, marginTop: 2
                            }} label={selectedDuration.toLocaleUpperCase()} size="small" />
                        </Button>
                        {open ? <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >{isDatePickerOpen ? <div style={{ flexDirection: 'column', display: 'flex' }}> <DateRange
                            editableDateInputs={true}
                            onChange={item => setDate({
                                ...item.selection,
                                startDate: item.selection.startDate,
                                endDate: moment(item.selection.endDate).endOf('d').toDate()
                            })}
                            moveRangeOnFirstSelection={false}
                            ranges={[date]}
                        /><Button size="small" onClick={handleClose}
                            variant="contained"
                            children="Apply"
                            color="primary" /></div> : <MenuList style={{ minWidth: 220 }}>
                            {durations.map((key) => <MenuItem
                                onClick={() => handleDurationSet(key)}
                                children={key.toLocaleUpperCase()}
                            />)}
                        </MenuList>}
                        </Popover> : <div />}
                    </Box>
                </Box>
            </Paper>
            <div style={{
                minHeight: 400, display: 'flex', paddingTop: 15, paddingBottom: 15,
                justifyContent: 'space-between'
            }}>
                <Paper style={{
                    width: "24%", display: 'flex', height: 500, alignItems: 'center', justifyContent: 'center'
                }}>
                    {loading ? <CircularProgress /> :
                        <Container style={{ alignSelf: 'flex-start', paddingTop: 30 }}>
                            <Typography variant="h5" color="inherit">Total Count</Typography>
                            <Typography color="textSecondary">{moment(date.endDate).diff(moment(date.startDate), 'd') == 0 ? moment(date.startDate).format('LL') : `${moment(date.startDate).format('D MMM, YYYY')} - ${moment(date.endDate).format('D MMM, YYYY')}`}  <Chip style={{
                                fontSize: 9, height: 13,
                                marginLeft: 10, marginTop: 2
                            }} label={selectedDuration.toLocaleUpperCase()} size="small" /></Typography>
                            <Typography variant="h3" color="inherit">{count || '---'}</Typography>
                        </Container>}
                </Paper>
                <Paper style={{
                    width: "75%", display: 'flex', height: 500,
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    {loading ? <CircularProgress /> :
                        <ApexCharts
                            width={780}
                            options={{
                                chart: {
                                    type: 'bar',
                                    height: 450,
                                    width: 780,
                                    stacked: true,
                                    zoom: { enabled: true },
                                    toolbar: {
                                        show: true,
                                    }
                                },
                                plotOptions: {
                                    bar: {
                                        horizontal: false,
                                    },
                                },
                                stroke: {
                                    width: 1,
                                    colors: ['#fff']
                                },
                                title: {
                                    text: 'Jobs per Videotemplate',
                                },
                                xaxis: {
                                    categories,
                                    labels: {
                                        formatter: function (val) {
                                            return getXAxisLabel(val)
                                        }
                                    }
                                },
                                yaxis: {

                                    labels: {
                                        formatter: function (val) {
                                            return val
                                        }

                                    }
                                },
                                tooltip: {
                                    y: {
                                        formatter: function (val) {
                                            return `${val} Jobs`
                                        }
                                    }, x: {
                                        formatter: function (val) {
                                            return getXAxisTitle(val)
                                        }
                                    }
                                },
                                fill: {
                                    opacity: 1,
                                },
                                legend: {
                                    position: 'bottom',
                                    horizontalAlign: 'left',
                                    // offsetX: 40
                                }
                            }
                            }
                            series={data}
                            type="bar" height={450} />

                    }

                </Paper>
            </div>
        </Container >

    );
};
