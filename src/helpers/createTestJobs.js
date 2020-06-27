export default ({ versions, id, }) => {
  return versions.map((v) => ({
    idVideoTemplate: id,
    idVersion: v.id,
    data: Object.assign({}, ...v.fields.map(field => ({ [field.key]: field?.label })))
  }));
};
