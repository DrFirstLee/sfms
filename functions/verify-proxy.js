export const handler = async (event, context) => {
    // Only allow GET requests
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405,
            body: "Method Not Allowed",
            headers: {
                "Allow": "GET"
            }
        };
    }

    // Extract authorization header
    const authHeader = event.headers.authorization || event.headers.Authorization;

    if (!authHeader) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: "No authorization header provided" }),
            headers: { "Content-Type": "application/json" }
        };
    }

    try {
        // Relay the request to your HTTP backend
        const response = await fetch('http://49.166.98.88:5001/api/verify', {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });

        // Get the data from the backend
        const data = await response.json();

        return {
            statusCode: response.status,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        };
    } catch (error) {
        console.error("Verify Proxy Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: error.toString() }),
            headers: {
                "Content-Type": "application/json"
            }
        };
    }
};
