export default ({ versions, id }) => {
  return versions.map((v) => ({
    idVideoTemplate: id,
    idVersion: v.id,
    data: Object.assign(
      {},
      ...v.fields.map((field) =>
        field.type === "file"
          ? {
              [field.key]: `https://dummyimage.com/${field.constraints.width}x${field.constraints.height}/0011ff/fff`,
            }
          : { [field.key]: field?.label }
      )
    ),
  }));
};
