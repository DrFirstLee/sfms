export const handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed",
            headers: {
                "Allow": "POST"
            }
        };
    }

    try {
        const { username, password } = JSON.parse(event.body);

        // Relay the request to your HTTP backend
        const response = await fetch('http://49.166.98.88:5001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
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
        console.error("Login Proxy Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: error.toString() }),
            headers: {
                "Content-Type": "application/json"
            }
        };
    }
};
