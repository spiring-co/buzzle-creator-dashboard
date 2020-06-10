const JSZip = require("jszip");
const zip = new JSZip();

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

function downloadBlob(blob, filename) {
  // Create an object URL for the blob object
  const url = URL.createObjectURL(blob);

  // Create a new anchor element
  const a = document.createElement("a");

  // Set the href and download attributes for the anchor element
  // You can optionally set other attributes like `title`, etc
  // Especially, if the anchor element will be attached to the DOM
  a.href = url;
  a.download = filename || "download";

  // Click handler that releases the object URL after the element has been clicked
  // This is required for one-off downloads of the blob content
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.removeEventListener("click", clickHandler);
    }, 150);
  };

  // Add the click event listener on the anchor element
  // Comment out this line if you don't want a one-off download of the blob content
  a.addEventListener("click", clickHandler, false);

  // Programmatically trigger a click on the anchor element
  // Useful if you want the download to happen automatically
  // Without attaching the anchor element to the DOM
  // Comment out this line if you don't want an automatic download of the blob content
  a.click();

  // Return the anchor element
  // Useful if you want a reference to the element
  // in order to attach it to the DOM or use it in some other way
  return a;
}

export async function zipMaker(assets) {
  try {
    await assets.map((item, index) => {
      zip.file(`${item.name}`, item);
    });

    return new Promise((resolve, reject) => zip
      .generateAsync({ type: "blob" })
      .then(blob => resolve(blob)).catch(reject))
  } catch (err) {
    throw new Error(err);
  }
}

export async function s3FileReader(fileUrl) {
  // TODO s3 read file using url
  // return the fileObj from s3
  //return {}
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
