import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    Link as RouterLink,
    useHistory,
    useLocation,
    useRouteMatch,
} from "react-router-dom";
import ShopIcon from '@material-ui/icons/Shop';
// libs
import * as timeago from "timeago.js";
import MaterialTable, { Query, Column, Action, MTableCell } from "material-table";
import {
    Avatar,
    Box,
    Chip,
    Fade,
    Paper,
    Tooltip,
} from "@material-ui/core";
// icons
import PublishIcon from "@material-ui/icons/Publish";
import { SnackbarKey, useSnackbar } from "notistack";
// services
import { useAuth } from "services/auth";
import { useAPI } from "services/APIContext";
import JSONEditorDialoge from "common/JSONEditorDialoge";
import { publishState, VideoTemplate } from "services/buzzle-sdk/types";
import { ExtraSmallText } from "common/Typography";
import VideoTemplatePublishDialog from "domains/VideoTemplate/VideoTemplatePublishDialog";
import { Add } from "@material-ui/icons";
import { useReAuthFlow } from "services/Re-AuthContext";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
type IProps = {
    ownership: 'public' | "owned"
}
export default ({ ownership }: IProps) => {
    const history = useHistory();
    // const { } = useLocation()
    const { VideoTemplate, User, } = useAPI()
    let queryParam = useQuery();
    let { url, path } = useRouteMatch();
    // state variables
    const [error, setError] = useState<Error | null>(null);
    const [selectedVideoTemplate, setSelectedVideoTemplate] = useState<VideoTemplate | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [mode, setMode] = useState<"publish" | "editor" | "">("")
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { user, refreshUser, } = useAuth();
    const { reAuthInit } = useReAuthFlow()
    const { role } = user;
    const tableRef = useRef<any>(null);
    const handleAddTemplate = async (id: string) => {
        let loading: SnackbarKey | null = null
        try {
            loading = enqueueSnackbar("Adding template to your templates", {
                persist: true,
            })
            const user = await User.addTemplate([id])
            refreshUser(user.data)
            handleRefresh()
            loading !== null ? closeSnackbar(loading) : console.log("not loading")
            enqueueSnackbar("Template added successfully, No you can render it from Your templates", {
                variant: 'success'
            })

        } catch (err) {
            loading !== null ? closeSnackbar(loading) : console.log("not loading")
            enqueueSnackbar("Failed to add template to your templates", {
                variant: 'error'
            })
        }
    }
    const handleDelete = async (id: string) => {
        try {
            setIsDeleting(true);
            await reAuthInit()
            await VideoTemplate.delete(id);
            tableRef.current && tableRef.current.onQueryChange();
            setIsDeleting(false);
        } catch (err) {
            setIsDeleting(false);
            setError(err as Error);
        }
    };


    const handleRefresh = () => {
        setError(null);
        tableRef.current && tableRef.current.onQueryChange();
    };


    const getDataFromQuery = useCallback((query: Query<VideoTemplate>) => {
        const {
            page = 0,

            pageSize = 50,
            search = "",
            orderBy: { field: orderBy = "dateUpdated" } = {},
            orderDirection = "desc",
        } = query;
        history.push(
            `?page=${page + 1}&size=${pageSize}${search ? "&searchQuery=" + search : ""
            }`
        );
        // if has search query
        // if (searchQuery) {
        //   return ({ data: [], page: 1, totalCount: 0 }); //TODO
        // }
        return VideoTemplate.getAll(
            page + 1,
            pageSize,
            "",
            orderBy,
            orderDirection ? orderDirection : "desc",
            { type: ownership, fields: 'createdBy' }
        )
            .then(({ data, count: totalCount }) => {
                return { data, page, totalCount };
            })
            .catch((err) => {
                setError(err);
                return {
                    data: [],
                    page,
                    totalCount: 0,
                };
            });
    }, []);

    const handleVideoTemplateUpdate = useCallback(() => async (data: Partial<VideoTemplate>) => {
        try {
            if (!data.id) {
                enqueueSnackbar(
                    `Failed to update, Mssing Video Template Id!`,
                    {
                        variant: "error",
                    }
                );
                return
            }
            await VideoTemplate.update(data?.id || "", { ...data });
            enqueueSnackbar(`Video Template Updated successfully!`, {
                variant: "success",

            });
            setSelectedVideoTemplate(null);
            // tableRef.current && tableRef.current.onQueryChange();
        } catch (err) {
            setSelectedVideoTemplate(null);
            enqueueSnackbar(
                `Failed to update, ${(err as Error)?.message ?? "Something went wrong"}`,
                {
                    variant: "error",
                }
            );
        }
    }, [])
    const onRowClick = useCallback((e?: React.MouseEvent<Element, MouseEvent>,
        //@ts-ignore
        { tableData, ...video }?: VideoTemplate) => {
        if (!video?.id) {
            return
        }
        history.push(`${path}${video?.slug || video?.id}`);
    }, [path])
    const handleReset = () => {
        setSelectedVideoTemplate(null)
        setMode("")
    }
    const columns: Column<VideoTemplate>[] = useMemo(() => [
        {
            title: "Title",
            field: "title",
            render: ({ title, thumbnail }) => <div>
                <Chip
                    avatar={<Avatar alt="Natacha" src={thumbnail} />}
                    label={title}
                    variant="outlined"
                />
            </div>,
        },
        {
            title: "Owned by",
            render: function ({
                idCreatedBy, createdBy = {}
            }) {
                return (
                    <Tooltip
                        TransitionComponent={Fade}
                        title={idCreatedBy === user?.uid ? "This template is owned by you" : `Owned by ${createdBy?.name ?? "Guest"}`}>
                        <Chip
                            size="small"
                            label={idCreatedBy === user?.uid ? "You" : (createdBy?.name ?? "Guest")}
                            style={{
                                background: idCreatedBy === user?.uid ? "#3742fa" : "#000",
                                color: "white",
                            }}
                        />
                    </Tooltip>
                );
            },
        },
        {
            title: "Versions",
            align: "left",
            render: ({ versions }) => <ExtraSmallText>{versions.length}</ExtraSmallText>,
        },
        {
            title: "Publish State",
            render: function ({
                publishState = "unpublished",
                rejectionReason = "",
            }) {
                return (
                    <Tooltip
                        TransitionComponent={Fade}
                        title={publishState.toLowerCase() === "rejected" && rejectionReason ? rejectionReason : publishState}>
                        <Chip
                            size="small"
                            label={publishState.toLowerCase()}
                            style={{
                                background: getColorFromState(publishState),
                                color: "white",
                            }}
                        />
                    </Tooltip>
                );
            },
        },
        {
            title: "Last Updated",
            render: ({ dateUpdated = "" }) => <ExtraSmallText>{timeago.format(new Date(dateUpdated))}</ExtraSmallText>
        },
    ], [])
    return (
        <Box>
            <MaterialTable
                components={{
                    Container: props => <Paper {...props} elevation={0} />,
                }}
                tableRef={tableRef}
                title=""
                onRowClick={onRowClick}
                columns={columns}
                // localization={{
                //   body: {
                //     emptyDataSourceMessage: error ? (
                //       <Box>
                //         <Typography>{error.message}</Typography>
                //         <Button
                //           onClick={handleRefresh}
                //           color="secondary"
                //           variant="outlined"
                //           children={"Retry"}
                //         />
                //       </Box>
                //     ) : (
                //       <Typography>
                //         <Link component={RouterLink} to={`${path}add`}>
                //           Click here
                //         </Link>{" "}
                //         to create a Video Template😀
                //       </Typography>
                //     ),
                //   },
                // }}
                actions={[
                    ({ id = "", idCreatedBy = "" }) => (user?.uid === idCreatedBy ? false : !user?.guestTemplateUsed.includes(id)) && user?.role === "user" ? null : {
                        icon: () => <Add />,
                        tooltip: `Create render of this template`,
                        //@ts-ignore
                        onClick: (e, { tableData, ...data }) => {
                            history.push({
                                pathname: "/testJob",
                                state: {
                                    videoTemplate: data,
                                    versions: data.versions,
                                },
                            });
                        },
                    },
                    ({ idCreatedBy = "", publishState = "" }) => user?.role == "admin" && publishState.toLowerCase() === "pending" ? {
                        icon: () => <PublishIcon />,
                        tooltip: `Approve template`,
                        //@ts-ignore
                        onClick: (e, { tableData, ...data }) => {
                            setSelectedVideoTemplate(data as VideoTemplate)
                            setMode('publish')

                        },
                    } : (user?.uid === idCreatedBy && (publishState.toLowerCase() == "unpublished" || publishState.toLowerCase() === "rejected")) ? {
                        icon: () => <PublishIcon />,
                        tooltip: `Publish template`,
                        //@ts-ignore
                        onClick: (e, { tableData, ...data }) => {
                            setSelectedVideoTemplate(data as VideoTemplate)
                            setMode('publish')

                        },
                    } : null,
                    ownership === "public" && user?.role === "user" ? {
                        icon: () => <ShopIcon />,
                        tooltip: `Add template to your templates`,
                        //@ts-ignore
                        onClick: (e, { tableData, ...data }) => {
                            handleAddTemplate((data as VideoTemplate)?.id ?? "")
                        }
                    } : null,
                    ({ idCreatedBy = "" }) => user?.uid === idCreatedBy || user?.role === "admin" ? {
                        icon: "edit",
                        tooltip: "Edit Template",
                        onClick: (e: any, data: any) => {
                            //@ts-ignore
                            delete data["tableData"];
                            history.push({
                                pathname: `${url}/${(data as VideoTemplate)?.slug || (data as VideoTemplate)?.id}/edit`,
                                state: {
                                    isEdit: true,
                                    video: data,
                                },
                            });
                        },
                    } : null,
                    ...(role === "admin" ? [{
                        icon: "code",
                        tooltip: "View/Edit JSON",
                        position: "row",
                        onClick: async (event: any, rowData: any) => {
                            setSelectedVideoTemplate(rowData as VideoTemplate);
                        },
                    },
                    {
                        icon: "delete",
                        tooltip: "Delete Template",
                        disabled: isDeleting,
                        onClick: async (event: any, item: any) => handleDelete((item as VideoTemplate)?.id || ""),
                    }] : []) as any,
                    {
                        icon: "refresh",
                        tooltip: "Refresh Data",
                        isFreeAction: true,
                        onClick: handleRefresh,
                    },
                ].filter(a => !!a)
                }
                data={getDataFromQuery}
                options={{
                    search: false,
                    sorting: false,
                    pageSize: parseInt(queryParam?.get("size") || "") || 30,
                    headerStyle: { fontWeight: 700, fontSize: 14, fontFamily: "Poppins" },
                    actionsColumnIndex: -1,
                }}
            />
            {selectedVideoTemplate !== null && mode !== "publish" && (
                <JSONEditorDialoge
                    json={selectedVideoTemplate}
                    onSubmit={handleVideoTemplateUpdate}
                    onClose={handleReset}
                />
            )}
            {selectedVideoTemplate !== null && mode === "publish" && <VideoTemplatePublishDialog data={selectedVideoTemplate}
                onDone={() => {
                    handleReset()
                    handleRefresh()
                }}
                handleClose={handleReset} />}
        </Box>
    );
};

const getColorFromState = (state: publishState) => {
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
}