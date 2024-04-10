export const downloadBase64Content = (base64Content: string) => {
    const dlink = document.createElement("a");
    dlink.setAttribute("href", base64Content);
    dlink.setAttribute("download", "signature.png");
    dlink.click();
}
