var JSZip = require("jszip");
var zip = new JSZip();

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

// function downloadBlob(blob, filename) {
//   // Create an object URL for the blob object
//   const url = URL.createObjectURL(blob);

//   // Create a new anchor element
//   const a = document.createElement("a");

//   // Set the href and download attributes for the anchor element
//   // You can optionally set other attributes like `title`, etc
//   // Especially, if the anchor element will be attached to the DOM
//   a.href = url;
//   a.download = filename || "download";

//   // Click handler that releases the object URL after the element has been clicked
//   // This is required for one-off downloads of the blob content
//   const clickHandler = () => {
//     setTimeout(() => {
//       URL.revokeObjectURL(url);
//       a.removeEventListener("click", clickHandler);
//     }, 150);
//   };

//   // Add the click event listener on the anchor element
//   // Comment out this line if you don't want a one-off download of the blob content
//   a.addEventListener("click", clickHandler, false);

//   // Programmatically trigger a click on the anchor element
//   // Useful if you want the download to happen automatically
//   // Without attaching the anchor element to the DOM
//   // Comment out this line if you don't want an automatic download of the blob content
//   a.click();

//   // Return the anchor element
//   // Useful if you want a reference to the element
//   // in order to attach it to the DOM or use it in some other way
//   return a;
// }

export async function zipMaker(assets) {
  try {
    await assets.map((item, index) => {
      zip.file(`${item.name}`, item);
    });

    await zip.generateAsync({ type: "blob" }).then(function (blob) {
      // TODO S3 upload here instead of download and return the uri from s3
      // set uri
      // downloadBlob(blob, "assets.zip");
    });
    // return uri
    return true;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
