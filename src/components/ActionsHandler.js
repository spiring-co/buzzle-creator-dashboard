import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  ListItemSecondaryAction,
  Paper,
  Button,
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditIcon from "@material-ui/icons/Edit";
import ActionDialog from "components/ActionDialog";
import PreRender from "components/PreRender";
import PostRender from "components/PostRender";
// a little function to help us with reordering the result
const reorder = (listArray, sourceIndex, targetIndex) => {
  const temp = listArray[sourceIndex];
  listArray[sourceIndex] = listArray[targetIndex];
  listArray[targetIndex] = temp;
  return listArray;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // styles we need to apply on draggables
  ...draggableStyle,
  ...(isDragging && {
    background: "rgb(235,235,235)",
  }),
});

const getListStyle = () => ({
  //background: isDraggingOver ? 'lightblue' : 'lightgrey',
});

export default ({ initialValues, onSubmit }) => {
  const [prerenderActions, setPrerenderActions] = useState([
    {
      installFonts: {
        module: "install-fonts",
        fonts: [
          "SourceSansPro-Blackd",
          "SourceSansPro-BlackItd",
          "SourceSansPro-Boldd",
          "SourceSansPro-BoldItd",
        ],
      },
    },
  ]);
  const [editIndex, setEditIndex] = useState(0);
  const [postrenderActions, setPostrenderActions] = useState([
    {
      compress: {
        module: "@nexrender/action-encode",
        preset: "mp4",
        output: "encoded.mp4",
      },
    },
    {
      addWaterMark: {
        module: "action-watermark",
        input: "encoded.mp4",
        watermark:
          "http://assets.stickpng.com/images/5cb78678a7c7755bf004c14c.png",
        output: "watermarked.mp4",
      },
    },
    {
      upload: {
        module: "@nexrender/action-upload",
        input: "encoded.mp4",
        provider: "s3",
        params: {
          region: "us-east-1",
          bucket: "bulaava-assets",
          key: `outputs/filename.mp4`,
          //TODO better acl policy
          acl: "public-read",
        },
      },
    },
  ]);
  const [actionType, setActionType] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialValue, setInitialValue] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const onDragEndPrerender = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    setPrerenderActions(
      reorder(prerenderActions, result.source.index, result.destination.index)
    );
  };
  const onDragEndPostrender = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    setPostrenderActions(
      reorder(postrenderActions, result.source.index, result.destination.index)
    );
  };
  const handleActionSubmit = () => {
    if (isEdit) {
      switch (actionType) {
        case "prerender":
          prerenderActions[editIndex] = initialValue;
          setPrerenderActions(prerenderActions);
          handleClose();

          break;
        case "postrender":
          postrenderActions[editIndex] = initialValue;
          setPostrenderActions(postrenderActions);
          handleClose();

          break;

        default:
          break;
      }
    } else {
      switch (actionType) {
        case "prerender":
          prerenderActions.push(initialValue);
          setPrerenderActions(prerenderActions);
          handleClose();

          break;
        case "postrender":
          postrenderActions.push(initialValue);
          setPrerenderActions(prerenderActions);
          handleClose();

          break;
        default:
          handleClose();
          break;
      }
      // save initialValue as updated value
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setActionType(null);
    setInitialValue({});
    setEditIndex(0);
    setIsEdit(false);
  };
  const handleOpen = (type, value, index) => {
    // set initial value
    setEditIndex(index);
    setIsEdit(true);
    setActionType(type);
    setInitialValue(value);
    setIsDialogOpen(true);
  };
  const actions = {
    postrender: (
      <PostRender
        initialValue={initialValue}
        handleEdit={(obj) => setInitialValue(obj)}
      />
    ),
    prerender: (
      <PreRender
        initialValue={initialValue}
        handleEdit={(obj) => setInitialValue(obj)}
      />
    ),
  };
  return (
    <Paper style={{ padding: 20 }}>
      <Button
        color="primary"
        onClick={() => {
          setIsDialogOpen(true);
          setActionType("prerender");
        }}
        variant="contained"
        children="Add Prerender Action"
      />
      <DragDropContext onDragEnd={onDragEndPrerender}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <RootRef rootRef={provided.innerRef}>
              <List style={getListStyle(snapshot.isDraggingOver)}>
                {prerenderActions.length !== 0 ? (
                  prerenderActions.map((item, index) => {
                    var name = Object.keys(item)[0];
                    return (
                      <Draggable key={name} draggableId={name} index={index}>
                        {(provided, snapshot) => (
                          <Paper>
                            <ListItem
                              ContainerComponent="li"
                              ContainerProps={{ ref: provided.innerRef }}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}>
                              <ListItemText
                                primary={name}
                                secondary={Object.keys(item[name])?.map(
                                  (key, index) => (
                                    <Typography>{`${[key]}: ${JSON.stringify(
                                      item[name][key]
                                    )}`}</Typography>
                                  )
                                )}
                              />
                              <ListItemSecondaryAction>
                                <IconButton
                                  onClick={() =>
                                    handleOpen(
                                      "prerender",
                                      { [name]: item[name] },
                                      index
                                    )
                                  }>
                                  <EditIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          </Paper>
                        )}
                      </Draggable>
                    );
                  })
                ) : (
                  <p>No Action</p>
                )}
                {provided.placeholder}
              </List>
            </RootRef>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        color="primary"
        onClick={() => {
          setActionType("postrender");
          setIsDialogOpen(true);
        }}
        variant="contained"
        children="Add Postrender Action"
      />
      <DragDropContext onDragEnd={onDragEndPostrender}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <RootRef rootRef={provided.innerRef}>
              <List style={getListStyle(snapshot.isDraggingOver)}>
                {postrenderActions.length !== 0 ? (
                  postrenderActions.map((item, index) => {
                    var name = Object.keys(item)[0];
                    return (
                      <Draggable key={name} draggableId={name} index={index}>
                        {(provided, snapshot) => (
                          <Paper>
                            <ListItem
                              ContainerComponent="li"
                              ContainerProps={{ ref: provided.innerRef }}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}>
                              <ListItemText
                                primary={name}
                                secondary={Object.keys(item[name])?.map(
                                  (key, index) => (
                                    <Typography>{`${[key]}: ${JSON.stringify(
                                      item[name][key]
                                    )}`}</Typography>
                                  )
                                )}
                              />
                              <ListItemSecondaryAction>
                                <IconButton
                                  onClick={() =>
                                    handleOpen(
                                      "postrender",
                                      { [name]: item[name] },
                                      index
                                    )
                                  }>
                                  <EditIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          </Paper>
                        )}
                      </Draggable>
                    );
                  })
                ) : (
                  <p>No Action</p>
                )}
                {provided.placeholder}
              </List>
            </RootRef>
          )}
        </Droppable>
      </DragDropContext>
      {isDialogOpen && (
        <ActionDialog
          children={actions[actionType]}
          title={
            actionType === "postrender"
              ? "Post Render Action"
              : "Pre Render Action"
          }
          handleClose={handleClose}
          onSubmit={handleActionSubmit}
        />
      )}
    </Paper>
  );
};

// convert it to array post render and pre render
// reordder as per array
//render as per array
