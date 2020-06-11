export default ({ versions, id, staticAssets }) => {
  return versions.map((v) => ({
    idVideoTemplate: id,
    idVersion: v.id,
    assets: [...staticAssets, ...v.editableLayers.map(
      ({ type, label, layerName, width, height }) => {
        switch (type) {
          case "data":
            return {
              type,
              value: label,
              layerName,
              property: "Source Text",
            };
          case "image":
            return {
              type,
              layerName,
              src: `https://dummyimage.com/${width}x${height}/0011ff/fff`,
              extension: "png",
            };
          default:
            return;
        }
      }
    )],
  }));
};
