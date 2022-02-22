export const copyToClipboard = async (text: string) => {
    //@ts-ignore
    const result = await navigator.permissions.query({ name: "clipboard-write" })
    if (result.state == "granted" || result.state == "prompt") {
        return navigator.clipboard.writeText(`${text}`).then(function () {
            return Promise.resolve()
        }, function (reason) {
           return  Promise.reject("Copying not supported in your browser!")
        });
    }
}