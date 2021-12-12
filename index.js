addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});
/**
 * Respond with 1x1 transparent GIF
 * @param {Request} request
 */
async function handleRequest(request) {
    const imgBase64 =
        "R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
    const img = Uint8Array.from(atob(imgBase64), (c) => c.charCodeAt(0));
    return new Response(img, {
        headers: { "content-type": "image/gif", "content-length": img.length },
    });
}
