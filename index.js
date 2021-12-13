addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

/**
 * Return location JSON or error
 * @param {String} ip
 */

const getLocation = async (ip) => {
    const ipUrl = `http://www.geoplugin.net/json.gp?ip=${ip}`;
    await fetch(ipUrl)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            return error;
        });
};

/**
 * Respond with 1x1 transparent GIF
 * @param {Request} request
 */

const handleRequest = async (request) => {
    const imgBase64 =
        "R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
    const img = Uint8Array.from(atob(imgBase64), (c) => c.charCodeAt(0));

    const ip =
        request.headers.get("x-forwarded-for")?.split(",").shift() ||
        request.headers.get("CF-Connecting-IP")?.split(",").shift() ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        (request.connection.socket
            ? request.connection.socket.remoteAddress
            : null);
    if (!ip) {
        return new Response("No IP found", {
            headers: { "content-type": "text/plain" },
            status: 400,
        });
    }

    const ipLocation = getLocation(ip);
    console.log(
        ipLocation,
        ipLocation["geoplugin_request"],
        ipLocation["geoplugin_city"],
        ipLocation["geoplugin_region"],
        ipLocation["geoplugin_countryName"]
    );

    const urlParams = new URL(request.url).searchParams;
    console.log(request.url);
    const toPerson = (urlParams.get("to") || "no-direct-person")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    const notes = (urlParams.get("notes") || "no-notes")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    console.log(toPerson, notes);

    return new Response(img, {
        headers: { "content-type": "image/gif", "content-length": img.length },
    });
};
