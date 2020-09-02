const JSZip = require("jszip");
const zip = new JSZip();


export async function zipMaker(staticAssets, aepFile) {
    try {
        const name = aepFile.substr(aepFile.lastIndexOf("/") + 1)
        const file = await (await fetch(aepFile)).blob()
        zip.file(name, file)
        await Promise.all(
            staticAssets.map(async ({ name, src }) =>
                zip.file(`assets/${name}`, await (await fetch(src)).blob()))
        )
        downloadBlob(await zip.generateAsync({ type: "blob" }), `${name.substr(0, name.lastIndexOf("."))}.zip`);
        zip.remove("assets")
        zip.remove("name")

        return true
    } catch (err) {
        console.log(err);
        // throwError
    }
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