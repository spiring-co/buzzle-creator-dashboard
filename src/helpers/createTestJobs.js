export default ({ versions, id }) => {
  return versions.map((v) => ({
    idVideoTemplate: id,
    idVersion: v.id,
    data: Object.assign(
      {},
      ...v.fields.map((field) =>
        field.type === "image"
          ? {
            [field.key]: `https://via.placeholder.com/${field.constraints.width}x${field.constraints.height}/0011ff/fff.${field.rendererData.extension}/?text=Spiring`,
          }
          : { [field.key]: field?.label }
      )
    ),
  }));
};
