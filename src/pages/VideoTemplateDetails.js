import {
  Button,
  LinearProgress,
  Paper,
  Typography, Container, Box,
  withStyles, Chip
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Job, VideoTemplate, Creator } from "services/api";
import React, { useState, useEffect } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import useApi from "services/apiHook";
import { zipMaker } from "helpers/downloadTemplateHelper"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import formatTime from "helpers/formatTime";
import { useCurrency } from "services/currencyContext"
import RejectionReasonPrompt from "./RejectionReasonPrompt";
import RoleBasedView from "components/RoleBasedView";

const CustomProgress = withStyles({
  colorPrimary: {
    backgroundColor: "#b2dfdb",
  },
  barColorPrimary: {
    backgroundColor: "#00695c",
  },
})(LinearProgress);

export default () => {
  const { url } = useRouteMatch();
  const { id } = useParams();
  const history = useHistory();
  const { getConvertedCurrency } = useCurrency()
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState(null);
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    try {
      setData(await VideoTemplate.get(id))
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(err)
    }
  }

  const handleDownload = async () => {
    setIsLoading(true);
    await zipMaker(data?.staticAssets, data?.src);
    setIsLoading(false);
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

  const handleDelete = async () => {
    const action = window.confirm("Are you sure, you want to delete");
    if (!action) return;

    try {
      setIsDeleting(true);
      await VideoTemplate.delete(id);
    } catch (err) {
      setError(err);
    } finally {
      setIsDeleting(false);
    }
  };


  const handleUpdateTemplate = async (publishState = "unpublished", rejectionReason = "") => {
    try {
      setIsLoading(true)
      await VideoTemplate.update(data?.id, { ...data, publishState, rejectionReason })
      setIsLoading(false)
      history.push('/home/videoTemplates')
    } catch (err) {
      setIsLoading(false)
      setError(err)
    }
  }


  return (
    <div>
      {loading || isDeleting || isLoading ? <CustomProgress /> : ""}
      {error && <Alert severity="error" children={`${error.message}`} />}
      <Paper style={{ padding: 20 }}>
        <Container>
          <video
            id="sample"
            controls={true}
            style={{ width: 300, height: 200, marginTop: 10 }}
            src={data?.versions ?? [][0]?.sample}
          />
          <div>
            <Typography variant="h6">{data?.title}</Typography>
            <Typography >{data?.description}</Typography>
            <Box>
              <Typography style={{ marginTop: 10, }}>
                Publish State
            </Typography>
              <Chip
                size="small"
                label={data?.publishState?.toUpperCase() ?? 'UNPUBLISHED'}
                style={{
                  background: getColorFromState(data?.publishState ?? 'unpublished'),
                  color: "white",
                }}
              />
            </Box>
            {data?.rejectionReason && <Box>
              <Typography style={{ marginTop: 10, }}>
                Reason
            </Typography>
              <Typography style={{ color: getColorFromState(data?.publishState ?? 'unpublished') }}>
                {data?.rejectionReason}
              </Typography>
            </Box>}
            <RoleBasedView allowedRoles={['Admin']}><Table size="small" aria-label="a dense table" style={{ marginTop: 20, marginBottom: 20 }}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Version Name</StyledTableCell>
                  <StyledTableCell >Average Render Time</StyledTableCell>
                  <StyledTableCell >Render Cost/min</StyledTableCell>
                  <StyledTableCell >Render Cost</StyledTableCell>
                  <StyledTableCell >Loyalty Amount</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {data?.versions?.map(({ id, title, averageRenderTime = "", loyaltyCurrency, loyaltyValue = 0.0 }) => (
                  <StyledTableRow key={id}>
                    <StyledTableCell >
                      {title}
                    </StyledTableCell>
                    <StyledTableCell >{!averageRenderTime ? 'NA' : `${formatTime(averageRenderTime)}`}</StyledTableCell>
                    {/* TODO  here comes the fixed cost /min for render */}
                    <StyledTableCell>{getConvertedCurrency(5, 'INR', 'INR')}</StyledTableCell>
                    {/* TODO  here comes the fixed cost /min for render instead of 5 */}
                    <StyledTableCell>{getConvertedCurrency(getRenderCostForTemplate(averageRenderTime, 5).toFixed(2), 'INR', 'INR')}</StyledTableCell>
                    <StyledTableCell >
                      {`${loyaltyValue} ${loyaltyCurrency} ${loyaltyCurrency !== 'INR' ? `(${getConvertedCurrency(loyaltyValue, loyaltyCurrency, 'INR')})` : ''}`}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table></RoleBasedView>
            <RoleBasedView
              allowedRoles={['Creator']}
            ><Button
              style={{ margin: 10, marginLeft: 0 }}
              variant="contained"
              color="primary"
              onClick={handleEdit}>
                Edit
            </Button>
              <Button
                style={{ margin: 10, marginLeft: 0 }}
                variant="contained"
                color="primary"
                onClick={() => {
                  history.push({
                    pathname: `${url}/publish`,
                    state: {
                      videoTemplate: data
                    },
                  });
                }}>
                {data?.isPublished ?? false ? "RE-PUBLISH" : "PUBLSH"}
              </Button>
              <Button
                component={"a"}
                target="_blank"
                style={{ margin: 10, marginLeft: 0 }}
                variant="contained"
                color="primary"
                href={data?.src}>
                Download AEP(X)
            </Button>
              <Button
                disabled={isLoading}
                style={{ margin: 10, marginLeft: 0 }}
                variant="contained"
                color="primary"
                onClick={handleDownload}>
                {isLoading ? 'Preparing...' : 'Download template with assets'}
              </Button>
              <Button
                style={{ margin: 10 }}
                disabled={isDeleting}
                variant="outlined"
                color="secondary"
                onClick={handleDelete}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button></RoleBasedView>
            <RoleBasedView allowedRoles={['Admin']}>
              {(data?.publishState === 'pending' || data?.publishState === 'rejected') && <Button
                disabled={isLoading}
                style={{ margin: 10, marginLeft: 0 }}
                variant="contained"
                color="primary"
                onClick={() => handleUpdateTemplate("published")
                }
                children="Approve"
              />}{(data?.publishState !== 'unpublished') && <Button
                disabled={data?.publishState === 'rejected' || isLoading}
                style={{ margin: 10, marginLeft: 0 }}
                variant="contained"
                color="secondary"
                onClick={() => setIsDialogOpen(true)}
                children={data?.publishState === 'rejected' ? "Rejected" : 'Reject'}
              />}
              <RejectionReasonPrompt
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={({ rejectionReason }) => {
                  handleUpdateTemplate("rejected", rejectionReason)
                  setIsDialogOpen(false)
                }}
                value={data?.rejectionReason}
              /></RoleBasedView>
          </div>
        </Container>
      </Paper>
    </div >
  );
};


const getRenderCostForTemplate = (time, value) => {
  return ((time / 60000) * value)
}
const getColorFromState = (state) => {
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