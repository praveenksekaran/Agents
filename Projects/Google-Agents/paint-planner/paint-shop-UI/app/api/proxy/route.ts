
import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // Allow method to be passed, default to 'query' but we expect 'create_session' based on recent errors
        const method = body.method || 'query';
        const userInput = body.input; // Takes the whole object or string

        // Handle base URL cleanup if it still has :query or similar
        let baseUrl = process.env.Agent_Query_URL;
        // || https://.../reasoningEngines/3947806395134377984
        //baseUrl = baseUrl.split(':')[0]; // Remove any existing method suffix like :query

        // Construct target URL with the requested method
        const TARGET_URL = `${baseUrl}:${method}`;

        console.log(`Proxying to: ${TARGET_URL} with method ${method}`);

        const auth = new GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });

        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        const accessToken = tokenResponse.token;

        if (!accessToken) {
            return NextResponse.json({ error: 'Failed to generate access token' }, { status: 500 });
        }

        // Send payload directly as received from frontend
        // The frontend is responsible for structuring it correctly for the specific method (create_session vs query)
        const payload = userInput || {};

        const response = await fetch(TARGET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Upstream API Error (${response.status}): ${errorText}`);
            return NextResponse.json({ error: response.statusText, details: errorText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Proxy Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
