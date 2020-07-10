import { apiClient } from "buzzle-sdk";
const { VideoTemplate } = apiClient({ baseUrl: process.env.REACT_APP_API_URL });

export default async (id, options) => {
  const {
    settingsTemplate,
    renderSettings,
    incrementFrame,
    dataFillType,
  } = options;
  const { versions } = await VideoTemplate.get(id);

  return versions.map((v) => {
    return {
      idVideoTemplate: id,
      idVersion: v.id,
      renderPrefs: {
        settingsTemplate,
        incrementFrame,
        renderSettings,
      },
      data: fieldsToData(v.fields, dataFillType),
    };
  });
};

function fieldsToData(fields, dataFillType) {
  const data = {};
  fields.map((f) => {
    switch (f.type) {
      case "image":
        data[
          f.key
        ] = `https://dummyimage.com/${f.constraints.width}x${f.constraints.height}/3742fa/fff.${f.rendererData.extension}`;
        break;
      default:
        switch (dataFillType) {
          case "label":
            data[f.key] = f.label;
            break;
          case "placeholder":
            data[f.key] = f.placeholder;
            break;
          case "maxLength":
            data[f.key] = f.label
              .repeat(f.constraints?.maxLength || 80)
              .substr(0, f.constraints?.maxLength || 80);
            break;
        }
    }
  });
  return data;
}
