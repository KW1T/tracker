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
 * Turn Base64 encoded URL string to actual URL
 * @param {URL} url
 */

const urlBtoa = (url) => {
    let urlObj = new URL(url);
    const decodedUrlPart = atob(urlObj.pathname.slice(1));
    urlObj.pathname = "/" + decodedUrlPart;
    return urlObj;
};

/**
 * Get search params
 * @param {URL} url
 */

const getSearchParams = (url) => {
    const urlParams = url.searchParams;
    let returnParams = {};
    for (var value of urlParams.keys()) {
        returnParams[value] = urlParams.get(value);
    }
    returnParams.to = (returnParams.to || "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    returnParams.notes = (returnParams.notes || "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    return returnParams;
};

/**
 * Generate embed
 * @param {Object} urlParams
 * @param {String} ipLocationString
 */

const generateEmbed = (urlParams, ipLocationString) => {
    const {
        ["to"]: to,
        ["notes"]: notes,
        ["exclude"]: exclude,
        ...otherParams
    } = urlParams;
    var embed = {};
    embed.title = `📨 | ${to ? to : "Someone"} opened an email`;
    embed.description = `Location: ${ipLocationString}`;
    embed.fields = [];
    if (to) {
        embed.fields = embed.fields.concat({
            name: "👤 To",
            value: to,
            inline: true,
        });
    }
    if (notes) {
        embed.fields = embed.fields.concat({
            name: "📝 Notes",
            value: notes,
            inline: true,
        });
    }
    if (Object.keys(otherParams).length !== 0) {
        console.log(otherParams);
        let paramString = "";
        for (const [k, v] of Object.entries(otherParams)) {
            paramString = paramString.concat(`${k}: ${v}\n`);
        }
        embed.fields = embed.fields.concat({
            name: "✨ Other Values",
            value: `\`\`\`\n${paramString}\`\`\``,
        });
    }
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

    const decodedUrl = urlBtoa(request.url);
    const urlParams = getSearchParams(decodedUrl);

    const city = ipLocation["geoplugin_city"];
    if (
        urlParams.exclude &&
        urlParams.exclude.indexOf(city.toLowerCase()) != -1
    ) {
        return new Response(img, {
            headers: {
                "content-type": "image/gif",
                "content-length": img.length,
            },
        });
    }

    const embed = generateEmbed(urlParams, ipLocationString);

    await sendWebhook(embed);

    return new Response(img, {
        headers: { "content-type": "image/gif", "content-length": img.length },
    });
};
