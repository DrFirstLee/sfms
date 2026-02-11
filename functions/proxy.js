exports.handler = async function (event, context) {
    const { url } = event.queryStringParameters;
    const headers = event.headers;

    // Check if URL is present
    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing 'url' query parameter" })
        };
    }

    // Filter headers to pass to Naver (Client ID, Secret)
    // Netlify headers are lowercased
    const naverHeaders = {
        'x-ncp-apigw-api-key-id': headers['x-ncp-apigw-api-key-id'],
        'x-ncp-apigw-api-key': headers['x-ncp-apigw-api-key'],
        'Accept': 'application/json'
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: naverHeaders
        });

        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        return {
            statusCode: response.status,
            body: typeof data === 'string' ? data : JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.toString() })
        };
    }
}
