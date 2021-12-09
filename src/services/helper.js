
export function getLayersFromComposition(c, type = '', templateType = 'ae') {
  if (!c) return [];
  // if type is null
  if (templateType === 'remotion') {
    if (!type) {
      return {
        textLayers: getLayersFromComposition(c, "textLayers", templateType),
        imageLayers: getLayersFromComposition(c, "imageLayers", templateType),
      };
    }
    return c['fields']
  }
  if (!type) {
    return {
      textLayers: getLayersFromComposition(c, "textLayers", templateType),
      imageLayers: getLayersFromComposition(c, "imageLayers", templateType),
    };
  }
  if (c[type]) {
    return c[type].concat(
      ...Object.values(c.comps || {}).map((c) =>
        getLayersFromComposition(c, type, templateType)
      )
    );
  } else return []
}

export const getUniqueId = () => Math.random().toString(36).substr(2, 9);