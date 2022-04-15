import { TestJobVersionsParams, fillType } from "common/types";
import { FieldInterface, VersionInterface } from "services/buzzle-sdk/types";
export default (id: string, versions: TestJobVersionsParams) => {
  return versions.map((version) => {
    return {
      idVideoTemplate: id || "",
      idVersion: version?.id ?? "",
      renderPrefs: {
        ...(version?.settingsTemplate ? { settingsTemplate: version?.settingsTemplate } : {}),
        ...(version?.incrementFrame !== undefined ? { incrementFrame: version?.incrementFrame } : {}),
      },
      data: fieldsToData(version?.fields ?? [], version.dataFillType),
    };
  });
};

function fieldsToData(fields: Array<FieldInterface>, dataFillType: fillType): Record<string, string> {
  const data: any = {};
  fields.map((f) => {
    switch (f.type) {
      case "image":
        data[f.key] = `https://via.placeholder.com/${f.constraints.width}x${f.constraints.height}/dceef7/000.${f.rendererData?.extension}`
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

const getNumberPalindrome = (len: number, label: string) => {
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
