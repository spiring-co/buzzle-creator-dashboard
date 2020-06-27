
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

export const getUniqueId = () => Math.random().toString(36).substr(2, 9);