import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";

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
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";
import DeleteIcon from "@material-ui/icons/Delete";

import { VideoTemplate } from "services/api";
import { useCurrency } from "services/currencyContext";

import { zipMaker } from "helpers/downloadTemplateHelper";
import formatTime from "helpers/formatTime";

import RoleBasedView from "common/RoleBasedView";
import RejectionReasonPrompt from "../RejectionReasonPrompt";

const CustomProgress = withStyles({
  colorPrimary: {
    backgroundColor: "#b2dfdb",
  },
  barColorPrimary: {
    backgroundColor: "#00695c",
  },
})(LinearProgress);

export default () => {
  const { id } = useParams();
  const { url } = useRouteMatch();
  const history = useHistory();

  const { getConvertedCurrency } = useCurrency();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      setData(await VideoTemplate.get(id));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err);
    }
  };

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
      "&:nth-of-type(odd)": {
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

  const handleUpdateTemplate = async (
    publishState = "unpublished",
    rejectionReason = ""
  ) => {
    try {
      setIsLoading(true);
      await VideoTemplate.update(data?.id, {
        ...data,
        publishState,
        rejectionReason,
      });
      setIsLoading(false);
      history.push("/home/videoTemplates");
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  };

  return (
    <div>
      {loading || isDeleting || isLoading ? <CustomProgress /> : ""}
      {error && <Alert severity="error" children={`${error.message}`} />}
      <Paper>
        <Container>
          <div>
            {(data?.versions ?? [])[0]?.sample === undefined ? (
              <Typography>{"sample video not found"}</Typography>
            ) : (
              <video
                id="sample"
                controls={true}
                style={{ height: 320, width: "100%" }}
                src={(data?.versions ?? [])[0]?.sample}
              />
            )}
          </div>
          <div style={{ marginTop: 20 }}>
            <Typography style={{ marginBottom: 0 }} variant="h5">
              {data?.title}
            </Typography>
            <Divider />
            <Typography>{data?.description}</Typography>
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
              }}>
              <Typography style={{ marginTop: 10, marginBottom: 20 }}>
                Publish State :{" "}
              </Typography>
              <Typography
                style={{
                  color: getColorFromState(data?.publishState ?? "unpublished"),
                  marginTop: 10,
                  marginLeft: 10,
                }}>
                {data?.publishState?.toUpperCase() ?? "UNPUBLISHED"}
              </Typography>
            </Box>
            {data?.rejectionReason && (
              <Box>
                <Typography style={{ marginTop: 10 }}>Reason</Typography>
                <Typography
                  style={{
                    color: getColorFromState(
                      data?.publishState ?? "unpublished"
                    ),
                  }}>
                  {data?.rejectionReason}
                </Typography>
              </Box>
            )}
            <RoleBasedView allowedRoles={["Developer"]}>
              <Table
                size="small"
                aria-label="a dense table"
                style={{ marginTop: 10, marginBottom: 20 }}>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Version Name</StyledTableCell>
                    <StyledTableCell>Average Render Time</StyledTableCell>
                    <StyledTableCell>Render Cost/min</StyledTableCell>
                    <StyledTableCell>Render Cost</StyledTableCell>
                    <StyledTableCell>Loyalty Amount</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {data?.versions?.map(
                    ({
                      id,
                      title,
                      averageRenderTime = "",
                      loyaltyCurrency,
                      loyaltyValue = 0.0,
                    }) => (
                      <StyledTableRow key={id}>
                        <StyledTableCell>{title}</StyledTableCell>
                        <StyledTableCell>
                          {!averageRenderTime
                            ? "NA"
                            : `${formatTime(averageRenderTime)}`}
                        </StyledTableCell>
                        {/* TODO  here comes the fixed cost /min for render */}
                        <StyledTableCell>
                          {getConvertedCurrency(5, "INR", "INR")}
                        </StyledTableCell>
                        {/* TODO  here comes the fixed cost /min for render instead of 5 */}
                        <StyledTableCell>
                          {getConvertedCurrency(
                            getRenderCostForTemplate(
                              averageRenderTime,
                              5
                            ).toFixed(2),
                            "INR",
                            "INR"
                          )}
                        </StyledTableCell>
                        <StyledTableCell>
                          {`${loyaltyValue} ${loyaltyCurrency} ${
                            loyaltyCurrency !== "INR"
                              ? `(${getConvertedCurrency(
                                  loyaltyValue,
                                  loyaltyCurrency,
                                  "INR"
                                )})`
                              : ""
                          }`}
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </RoleBasedView>
            <RoleBasedView allowedRoles={["Creator"]}>
              <Button
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
                      videoTemplate: data,
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
                {isLoading ? "Preparing..." : "Download template with assets"}
              </Button>
              <Button
                style={{ marginLeft: 20 }}
                disabled={isDeleting}
                variant="contained"
                color="secondary"
                onClick={handleDelete}>
                <DeleteIcon />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </RoleBasedView>
            <RoleBasedView allowedRoles={["Admin"]}>
              {(data?.publishState === "pending" ||
                data?.publishState === "rejected") && (
                <Button
                  disabled={isLoading}
                  style={{ margin: 10, marginLeft: 0 }}
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdateTemplate("published")}
                  children="Approve"
                />
              )}
              {data?.publishState !== "unpublished" && (
                <Button
                  disabled={data?.publishState === "rejected" || isLoading}
                  style={{ margin: 10, marginLeft: 0 }}
                  variant="contained"
                  color="secondary"
                  onClick={() => setIsDialogOpen(true)}
                  children={
                    data?.publishState === "rejected" ? "Rejected" : "Reject"
                  }
                />
              )}
              <RejectionReasonPrompt
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={({ rejectionReason }) => {
                  handleUpdateTemplate("rejected", rejectionReason);
                  setIsDialogOpen(false);
                }}
                value={data?.rejectionReason}
              />
            </RoleBasedView>
          </div>
        </Container>
      </Paper>
    </div>
  );
};

const getRenderCostForTemplate = (time, value) => {
  return (time / 60000) * value;
};
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
