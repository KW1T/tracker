addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

/**
 * Return location JSON or error
 * @param {String} ip
 */

const getLocation = async (ip) => {
    const ipUrl = `http://www.geoplugin.net/json.gp?ip=${ip}`;
    let response = await fetch(ipUrl);
    if (response.ok) {
        return await response.json();
    } else {
        return await response.error();
    }
};

/**
 * Send webhook
 * @param {Object} embed
 */

const sendWebhook = async (embed) => {
    const embedJSON = JSON.stringify({ embeds: [embed] });
    let response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: embedJSON,
    });
    return response.ok;
};

/**
 * Get search params
 * @param {URL} url
 */

const getSearchParams = (url) => {
    const urlParams = url.searchParams;
    const toPerson = (urlParams.get("to") || "no-direct-person")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    const notes = (urlParams.get("notes") || "no-notes")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    return { toPerson: toPerson, notes: notes };
};

/**
 * Generate embed
 * @param {Object} urlParams
 * @param {String} ipLocationString
 */

const generateEmbed = (urlParams, ipLocationString) => {
    var embed = {};
    embed.title = `📨 | ${urlParams.toPerson} opened an email`;
    embed.description = `Location: ${ipLocationString}`;
    embed.fields = [
        { name: "👤", value: urlParams.toPerson, inline: true },
        { name: "📝", value: urlParams.notes, inline: true },
    ];
    embed.footer = {
        text: `Tracked with Trace 🔍`,
    };
    embed.color = 2895667;
    return embed;
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

    const ipLocation = await getLocation(ip);
    const ipLocationString = `${ipLocation["geoplugin_city"]}, ${ipLocation["geoplugin_region"]}, ${ipLocation["geoplugin_countryName"]} | ${ipLocation["geoplugin_request"]}`;

    const urlParams = getSearchParams(new URL(request.url));

    const embed = generateEmbed(urlParams, ipLocationString);

    await sendWebhook(embed);

    return new Response(img, {
        headers: { "content-type": "image/gif", "content-length": img.length },
    });
};
