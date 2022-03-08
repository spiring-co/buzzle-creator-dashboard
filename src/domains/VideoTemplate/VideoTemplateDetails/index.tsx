import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";
import clsx from 'clsx';
import {
  Box,
  Button,
  Container,
  LinearProgress,
  Paper,
  Divider,
  Typography,
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  CardActions,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";

import { useAPI } from "services/APIContext";
import { useCurrency } from "services/currencyContext";

import { zipMaker } from "helpers/downloadTemplateHelper";
import formatTime from "helpers/formatTime";
import VideoTemplatePublishDialog from "../VideoTemplatePublishDialog";
import { SmallText, SubHeading, Text } from "common/Typography";
import { Action, Pricing, publishState, VersionInterface, VideoTemplate } from "services/buzzle-sdk/types";
import { useSnackbar } from "notistack";
import { Delete, Description, Edit, ExpandMore, Folder } from "@material-ui/icons";
import { useAuth } from "services/auth";
import { useConfig } from "services/RemoteConfigContext";
import { useReAuthFlow } from "services/Re-AuthContext";
import { getNameFromActionText } from "helpers";
import AlertHandler from "common/AlertHandler";

const CustomProgress = withStyles({
  colorPrimary: {
    backgroundColor: "#b2dfdb",
  },
  barColorPrimary: {
    backgroundColor: "#00695c",
  },

})(LinearProgress);
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },

  }),
);
export default () => {
  const { id } = useParams<{ id: string }>();
  const { VideoTemplate, Pricing } = useAPI()
  const { state } = useLocation<{ videoTemplate?: VideoTemplate }>()
  const { reAuthInit } = useReAuthFlow()
  const [pricing, setPricing] = useState<Array<Pricing>>([])
  const { url } = useRouteMatch();
  const { user } = useAuth()
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar()
  const [operationInProgress, setOperationInProgress] = useState<"file" | "folder" | "delete" | "">("")
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState<boolean>(false);
  const classes = useStyles();
  const [data, setData] = useState<VideoTemplate>();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isGuestTemplate = data?.idCreatedBy !== user?.uid && user?.role !== "admin"
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      setError(null)
      setLoading(true)
      setData(state?.videoTemplate || await VideoTemplate.get(id));
      setPricing(await Pricing.video(id))
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err as Error)
    }
  };
  const toggleDialog = () => {
    setIsPublishDialogOpen(v => !v)
  }

  const handleDownload = async () => {
    try {
      setOperationInProgress("folder");
      await zipMaker(data?.staticAssets, data?.fonts, data?.src);
      setOperationInProgress("");
    } catch (err) {
      setOperationInProgress("");
      enqueueSnackbar((err as Error)?.message, {
        variant: 'error'
      })
    }
  };

  const handleEdit = async () => {
    history.push({
      pathname: `${url}/edit`,
      state: {
        isEdit: true,
        video: data,
      },
    });
  };

  const handleDelete = async () => {
    try {
      setOperationInProgress("delete")
      await reAuthInit()
      await VideoTemplate.delete(id);
      setOperationInProgress("")
    } catch (err) {
      setOperationInProgress("")
      enqueueSnackbar(((err as Error)?.message || err) as string, {
        variant: 'error'
      })
    }
  };

  return (
    <Paper style={{ minHeight: 300, width: '100%', padding: 15, }}>
      {error
        ? <Box style={{
          width: '100%', display: 'flex',
          minHeight: 300,
          flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <Text color="textSecondary">{error?.message}</Text>
          <Button onClick={init}
            style={{ marginTop: 10 }}
            children="retry"
            size="small"
            color="secondary"
            variant="outlined" />
        </Box>
        : loading
          ? <Box style={{
            width: '100%', display: 'flex',
            minHeight: 300,
            alignItems: 'center', justifyContent: 'center'
          }}>
            <CircularProgress size={25} color="primary" />
          </Box>
          : <>
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <SubHeading>{data?.title}</SubHeading>
              </Box>
              {isGuestTemplate ? <div /> : <Box style={{ display: 'flex', alignItems: 'center' }}>
                {data?.type === 'ae' ? <Tooltip title="Download AEP File">
                  <IconButton disabled={operationInProgress == 'file'} href={data?.src}>
                    {operationInProgress === 'file' ? <CircularProgress size={20} color="inherit" /> : <Description />}
                  </IconButton>
                </Tooltip> : <div />}
                <Tooltip title={operationInProgress === 'folder' ? "Downloading, Please wait..." : data?.type === "remotion" ? "Download Template Bundle" : "Download Full Template"}>
                  <IconButton disabled={operationInProgress == 'folder'} onClick={handleDownload}>
                    {operationInProgress === 'folder' ? <CircularProgress color="inherit" size={20} /> : <Folder />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Video Template">
                  <IconButton onClick={handleEdit}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                {user?.role === "admin" ?
                  <Tooltip title={operationInProgress === 'delete' ? "Deleting Template" : "Delete Template"}>
                    <IconButton onClick={handleDelete}>
                      {operationInProgress === 'delete' ? <CircularProgress color="inherit" size={20} /> : <Delete />}
                    </IconButton>
                  </Tooltip> : <div />}
              </Box>}
            </Box>
            <Divider style={{ marginTop: 8, marginBottom: 8 }} />
            <Text color="textSecondary">{data?.description || "No Description added!"}</Text>

            <Text style={{ fontWeight: 600, marginTop: 10 }}>Versions</Text>
            <Divider style={{ marginTop: 5, marginBottom: 5 }} />
            <Box style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start',
              padding: 15, paddingLeft: 0,
            }}>
              {data?.versions?.map((version) => {
                return <VideoTemplateCard isOwner={user?.uid === data?.idCreatedBy} price={pricing?.find(({ idVideoTemplate }) => idVideoTemplate === data?.id)} thumbnail={data?.thumbnail ?? ""} version={version} />
              })}
            </Box>
            {isGuestTemplate ? <div /> : <><Text style={{ fontWeight: 600, }}>Status</Text>
              <Divider style={{ marginTop: 5, marginBottom: 5 }} />
              <Box style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 15, paddingLeft: 0,
              }}>
                <Chip
                  size={"small"}
                  label={data?.publishState?.toUpperCase() || ""}
                  style={{
                    background: getColorFromState(data?.publishState),
                    color: "white",
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: 'Poppins',
                    marginRight: 10,
                  }}
                />
                {data?.rejectionReason && data?.publishState === 'rejected' ? <Box style={{ marginTop: 10 }}>
                  <Text style={{ fontWeight: 600 }}>Reason</Text>
                  <Text>{data?.rejectionReason}</Text>
                </Box> : <div />}
                {user?.role === "user" && (data?.publishState?.toLowerCase() === 'unpublished' || data?.publishState?.toLowerCase() === 'rejected')
                  ? <Button
                    onClick={toggleDialog}
                    style={{ marginTop: 15 }}
                    color="primary"
                    variant="contained"
                    size="small"
                    children={user?.role === "admin" ? "Review Template" : data?.rejectionReason && data?.publishState === 'rejected'
                      ? "Re-Apply"
                      : "Publish"} /> : (user?.role === "admin" && data?.publishState?.toLowerCase() === "pending") ? <Button
                        onClick={toggleDialog}
                        style={{ marginTop: 15 }}
                        color="primary"
                        variant="contained"
                        size="small"
                        children={"Review Template"} /> : <div />
                }
              </Box></>}
          </>}
      {isPublishDialogOpen ? <VideoTemplatePublishDialog
        pricing={pricing}
        data={data as VideoTemplate} handleClose={toggleDialog} onDone={(data) => {
          toggleDialog()
          setData(data)
          enqueueSnackbar(`Template ${user?.role === "admin" && data?.publishState === "rejected" ? "Rejected" : "Applied"} successfully!`, {
            variant: 'success'
          })
        }} /> : <div />}
    </Paper>
  );
};

// const getRenderCostForTemplate = (time, value) => {
//   return (time / 60000) * value;
// };
const getColorFromState = (state?: publishState) => {
  switch (state) {
    case "rejected":
      return "#f44336";
    case "pending":
      return "#ffa502";
    case "published":
      return `#4caf50`;
    default:
      return "grey";
  }
};

const VideoTemplateCard = ({ version, thumbnail, price, isOwner }: {
  isOwner: boolean,
  version: VersionInterface,
  thumbnail: string,
  price?: Pricing
}) => {
  const classes = useStyles()
  const { instances } = useConfig()
  const instancePrice = parseFloat(instances[0].SpotPrice) / (60 * 60)

  const { getConvertedCurrency, getConvertedCurrencyValue } = useCurrency()
  const [expanded, setExpanded] = useState<boolean>(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const noOfImageInputs = version?.fields?.filter(({ type }) => type === 'image').length
  const noOfTextInputs = version?.fields?.filter(({ type }) => (type === 'string' || type === 'data')).length
  return <Card variant="outlined" key={version.id}
    style={{
      maxWidth: 345,
      width: '100%',
      marginRight: 20, marginBottom: 20
    }}
  >
    <video
      height={150}
      controls
      width="100%"
      style={{ backgroundColor: '#000' }}
      poster={thumbnail}
      src={version?.sample} />
    <CardContent>
      <Text style={{ fontWeight: 600 }}>
        {version.title}
      </Text>
      <SmallText color="textSecondary" >
        Contains {noOfTextInputs} Text fields and {noOfImageInputs} Image fields
      </SmallText>
    </CardContent>
    <CardActions disableSpacing>
      <Text style={{ fontWeight: 600 }}>Pricing</Text>
      <IconButton
        className={clsx(classes.expand, {
          [classes.expandOpen]: expanded,
        })}
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
      >
        <ExpandMore />
      </IconButton>
    </CardActions>
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <AlertHandler style={{ borderRadius: 0, }} severity="info" message="This is an approx estimation of cost of render and add-on actions, Render Cost will be calculated from time taken to render!" />
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell><b>Actions</b></TableCell>
            <TableCell align="center"><b>HD (Approx)</b></TableCell>
            <TableCell align="center"><b>Full HD (Approx)</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* <TableCell>Loyalty Amount</TableCell>
          <TableCell>{price?.loyaltyAmount}</TableCell>
          <TableCell><b>{getConvertedCurrency(price?.half?.render?.price as number)}</b></TableCell> */}

          {["render", "buzzle-action-watermark", "buzzle-action-merge-videos", "buzzle-action-add-audio", "buzzle-action-add-thumbnail",
            "buzzle-action-video-orientation"].map((action) => {
              let half = price ? (price)?.half[action as Action]?.price || null : null
              let full = price ? (price)?.full[action as Action]?.price || null : null
              full = action === 'render' && !isOwner ? ((full || 0) as number) + (price?.loyaltyAmount || 0) : full
              half = action === 'render' && !isOwner ? ((half || 0) as number) + (price?.loyaltyAmount || 0) : half
              return (
                <TableRow key={action}>
                  <TableCell component="th" scope="row">
                    {getNameFromActionText(action as Action)}
                  </TableCell>
                  <TableCell align="center">{half
                    ? getConvertedCurrency(half as number, true)
                    : `${getConvertedCurrency(instancePrice, true)}/sec`}</TableCell>
                  <TableCell align="center">{full
                    ? getConvertedCurrency(full as number, true)
                    : `${getConvertedCurrency(instancePrice, true)}/sec`}</TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </Collapse>
  </Card>
}
