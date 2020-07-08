export default ({ versions, id }) => {
  return versions.map((v) => ({
    idVideoTemplate: id,
    idVersion: v.id,
    data: Object.assign(
      {},
      ...v.fields.map((field) =>
        field.type === "image"
          ? {
              [field.key]: `https://dummyimage.com/${field.constraints.width}x${field.constraints.height}/3742fa/fff.${field.rendererData.extension}`,
            }
          : { [field.key]: field?.label }
      )
    ),
  }));
};
