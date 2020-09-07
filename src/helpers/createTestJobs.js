import { apiClient } from "buzzle-sdk";
const { VideoTemplate } = apiClient({ baseUrl: process.env.REACT_APP_API_URL });

export default async (id, options) => {
  const {
    versionId,
    settingsTemplate,
    renderSettings,
    incrementFrame,
    dataFillType,
  } = options;
  const { versions } = await VideoTemplate.get(id);
  const version = versions.find(({ id }) => id === versionId)
  return {
    idVideoTemplate: id,
    idVersion: version.id,
    renderPrefs: {
      settingsTemplate,
      incrementFrame,
      renderSettings,
    },
    data: fieldsToData(version.fields, dataFillType),
  };
};

function fieldsToData(fields, dataFillType) {
  const data = {};
  fields.map((f) => {
    switch (f.type) {
      case "image":
        data[f.key] = `https://dummyimage.com/${f.constraints.width}x${
          f.constraints.height
          }/3742fa/fff.${f.rendererData.extension}&text=${encodeURI(f.label)}`;
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
            data[f.key] = getNumberPalindrome(
              f.constraints?.maxLength || 80,
              f.label
            );
            break;
        }
    }
  });
  return data;
}

const getNumberPalindrome = (len, label) => {
  if (label?.length > len) {
    return label.substr(0, len)
  }
  const n = len - label?.length || 0;
  const s1 = Array.from({ length: len / 2 }, (v, k) => k + 1)
    .join("-")
    .substr(0, n / 2);

  const s2 = s1.split("").reverse().join("");
  return s1 + label + s2;
};
