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

export default ({ prerender, postrender, onSubmit }) => {
  const [prerenderActions, setPrerenderActions] = useState(prerender);
  const [editIndex, setEditIndex] = useState(0);
  const [postrenderActions, setPostrenderActions] = useState(postrender);
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
  const handleSubmit = () => {
    onSubmit({
      prerender: postrenderActions.map((action, index) =>
        Object.values(action)[0]),
      postrender: postrenderActions.map((action, index) =>
        Object.values(action)[0])
    })

  }
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
          handleSubmit()
          handleClose();

          break;
        case "postrender":
          postrenderActions[editIndex] = initialValue;
          setPostrenderActions(postrenderActions);
          handleSubmit()
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
          handleSubmit()
          handleClose();

          break;
        case "postrender":
          postrenderActions.push(initialValue);
          setPrerenderActions(prerenderActions);
          handleSubmit()
          handleClose();

          break;
        default:
          handleSubmit()
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