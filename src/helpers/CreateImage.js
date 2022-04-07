export const createImage = url =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', error => reject(error))
        image.src = url
    })

function getRadianAngle(degreeValue) {
    return (degreeValue * Math.PI) / 180
}
export const getDiagonalLengthOfRectangle = ({ width, height }) => {
    return (Math.sqrt(width * width + height * height))
}
/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
export async function getCroppedImg(imageSrc, pixelCrop, rotation = 0, { width = 0, height = 0 }) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    width = parseInt(`${width || 0}`)
    height = parseInt(`${height || 0}`)
    const safeArea = Math.max(image.width, image.height) * 2
    // set each dimensions to double largest dimension to allow for a safe area for the
    // image to rotate in without being clipped by canvas context
    canvas.width = safeArea
    canvas.height = safeArea
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black";
    ctx.fill();
    // translate canvas context to a central location on image to allow rotating around the center.
    ctx.translate(safeArea / 2, safeArea / 2)
    ctx.rotate(getRadianAngle(rotation))
    ctx.translate(-safeArea / 2, -safeArea / 2)

    // draw rotated image and store data.
    ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
    )
    const data = ctx.getImageData(0, 0, safeArea, safeArea)

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black";
    ctx.fill();
    // paste generated rotate image with correct offsets for x,y crop values.
    ctx.putImageData(
        data,
        0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
        0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
    )
    //As Base64 string
    var canvasTemp = document.createElement("canvas");
    var ctx2 = canvasTemp.getContext("2d");
    canvasTemp.width = width
    canvasTemp.height = height
    ctx2.beginPath();
    ctx2.rect(0, 0, width, height)
    ctx2.fillStyle = "black";
    ctx2.fill();
    ctx2.drawImage(canvas, 0, 0, width, height);
    return canvasTemp.toDataURL("image/png", 1);

    // As a blob
    // return new Promise(resolve => {
    //     canvas.toBlob(file => {
    //         resolve(URL.createObjectURL(file))
    //     }, 'image/jpeg')
    // })
}

export function readFile(file) {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result), false)
        reader.readAsDataURL(file)
    })
}
export const ORIENTATION_TO_ANGLE = {
    '3': 180,
    '6': 90,
    '8': -90,
}
export async function getRotatedImage(imageSrc, rotation = 0) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const orientationChanged =
        rotation === 90 || rotation === -90 || rotation === 270 || rotation === -270
    if (orientationChanged) {
        canvas.width = image.height
        canvas.height = image.width
    } else {
        canvas.width = image.width
        canvas.height = image.height
    }

    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.drawImage(image, -image.width / 2, -image.height / 2)

    return new Promise(resolve => {
        canvas.toBlob(file => {
            resolve(URL.createObjectURL(file))
        }, 'image/jpeg')
    })
}
