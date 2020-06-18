import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Paper,
  Button,
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditIcon from "@material-ui/icons/Edit";
import ActionDialog from "components/ActionDialog";

// a little function to help us with reordering the result
const reorder = (listObj, sourceIndex, targetIndex) => {
  return Object.assign(
    {},
    ...Object.keys(listObj).map((objKey, objIndex) => {
      if (objIndex === sourceIndex) {
        // return obj of target index
        return {
          [Object.keys(listObj)[targetIndex]]:
            listObj[Object.keys(listObj)[targetIndex]],
        };
      } else if (objIndex === targetIndex) {
        // return obj of source index
        return {
          [Object.keys(listObj)[sourceIndex]]:
            listObj[Object.keys(listObj)[sourceIndex]],
        };
      } else {
        // return the object
        return { [objKey]: listObj[objKey] };
      }
    })
  );
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

export default () => {
  const [actions, setActions] = useState({
    action1: { key: "1" },
    action2: { key: "2" },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    setActions(reorder(actions, result.source.index, result.destination.index));
  };
  const handleActionSubmit = () => {
    setIsDialogOpen(false);
    alert("Saved");
  };
  return (
    <Paper style={{ padding: 20 }}>
      <Button
        color="primary"
        onClick={() => setIsDialogOpen(true)}
        variant="contained"
        children="Add Action"
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <RootRef rootRef={provided.innerRef}>
              <List style={getListStyle(snapshot.isDraggingOver)}>
                {Object.keys(actions).map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
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
                            primary={item}
                            secondary={actions[item].key}
                          />
                          <ListItemSecondaryAction>
                            <IconButton onClick={() => setIsDialogOpen(true)}>
                              <EditIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            </RootRef>
          )}
        </Droppable>
      </DragDropContext>
      {isDialogOpen && (
        <ActionDialog
          setIsDialogOpen={setIsDialogOpen}
          initialValues={{}}
          onSubmit={handleActionSubmit}
        />
      )}
    </Paper>
  );
};
