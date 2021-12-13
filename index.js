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
            console.log(data);
            return data;
        })
        .catch((error) => {
            console.log(error);
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
    console.log(ip);
    if (ip) {
        const ipLocation = getLocation(ip);
        console.log(
            ipLocation,
            ipLocation["geoplugin_request"],
            ipLocation["geoplugin_city"],
            ipLocation["geoplugin_region"],
            ipLocation["geoplugin_countryName"]
        );
    }

    return new Response(img, {
        headers: { "content-type": "image/gif", "content-length": img.length },
    });
};
