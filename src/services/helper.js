
export function getLayersFromComposition(c, type) {
  if (!c) return [];
  // if type is null
  if (!type) {
    return {
      textLayers: getLayersFromComposition(c, "textLayers"),
      imageLayers: getLayersFromComposition(c, "imageLayers"),
    };
  }
  if (c[type]) {
    return c[type].concat(
      ...Object.values(c.comps || {}).map((c) =>
        getLayersFromComposition(c, type)
      )
    );
  } else return [];
}

export const jobSchemaConstructor = (template) => {
  return template.versions.map((version) => {
    return {
      idVideoTemplate: template.id,
      idVersion: version.id,

      assets: (function () {
        return version.editableLayers.map((layer) => {
          switch (layer.type) {
            case "data":
              return {
                type: layer.type,
                value: layer.label,
                layerName: layer.layerName,
                property: "Source Text",
              };
            case "image":
              return {
                type: layer.type,
                layerName: layer.layerName,
                src: `https://dummyimage.com/${layer.width}x${layer.height}/0011ff/fff`,
                extension: "png",
              };
            default:
              return;
          }
        });
      })(),
    };
  });
};
