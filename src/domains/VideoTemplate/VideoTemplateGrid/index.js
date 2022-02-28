// <Box
//   display="flex"
//   alignItems="end"
//   justifyContent="space-between"
//   flexDirection="row"
//   p={1}>
//   <ToggleButtonGroup
//     size="small"
//     value={view}
//     exclusive
//     onChange={(e, v) => setView(v)}
//     aria-label="text alignment">
//     <Tooltip title="Grid view">
//       <ToggleButton value="grid" aria-label="list">
//         <GridOnIcon />
//       </ToggleButton>
//     </Tooltip>
//     <Tooltip title="List view">
//       <ToggleButton value="list" aria-label="grid">
//         <ListIcon />
//       </ToggleButton>
//     </Tooltip>
//   </ToggleButtonGroup>
// </Box>;

{
  /* <Box className={classes.root}>
  <GridList cellHeight={250} className={classes.gridList}>
    {data.map((tile) => (
      <GridListTile key={tile.thumbnail}>
        <img src={tile.thumbnail} alt={tile.title} />
        <GridListTileBar
          title={tile.title}
          subtitle={<span>by: {tile.idCreatedBy}</span>}
          actionIcon={
            <Tooltip title="View details">
              <IconButton
                onClick={() => {
                  history.push(`${path}${tile.id}`);
                }}
                aria-label={`info about ${tile.title}`}
                className={classes.icon}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          }
        />
      </GridListTile>
    ))}
  </GridList>
</Box>; */
}
