
import { GoogleAuth } from 'google-auth-library';

export class VertexAIService {
    private static instance: VertexAIService;
    private auth: GoogleAuth;
    // Base URL for the Reasoning Engine resource
    private baseUrl: string;

    private constructor() {
        this.auth = new GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });

        // Ensure clean URL without method suffix (look for :suffix at the end)
        // We use v1beta1 as required by Reasoning Engine custom methods
        const rawUrl = process.env.Agent_Query_URL || "https://us-central1-aiplatform.googleapis.com/v1beta1/projects/just-shell-483813-g3/locations/us-central1/reasoningEngines/7547273212938158080";
        // Remove :query or any other method suffix if it exists at the end of the URL
        this.baseUrl = rawUrl.replace(/:[^/]+$/, '').replace('/v1/', '/v1beta1/');
    }

    public static getInstance(): VertexAIService {
        if (!VertexAIService.instance) {
            VertexAIService.instance = new VertexAIService();
        }
        return VertexAIService.instance;
    }

    private async getAccessToken(): Promise<string> {
        const client = await this.auth.getClient();
        const tokenResponse = await client.getAccessToken();
        if (!tokenResponse.token) {
            throw new Error('Failed to generate access token');
        }
        return tokenResponse.token;
    }

    /**
     * Executes a method on the Reasoning Engine (root).
     * Uses the :query endpoint with classMethod dispatcher.
     */
    public async execute(methodName: string, payload: any): Promise<any> {
        const token = await this.getAccessToken();
        const url = `${this.baseUrl}:query`;

        console.log(`[VertexAIService] Executing root method '${methodName}' at ${url}`);

        const body = {
            input: payload,
            classMethod: methodName
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[VertexAIService] Error ${response.status}: ${errorText}`);
            throw new Error(`Vertex AI API Error: ${response.statusText} - ${errorText}`);
        }

        return await response.json();
    }

    /**
     * Executes a method on a specific Session sub-resource.
     * URL pattern: {baseUrl}/sessions/{sessionId}:{methodName}
     */
    public async executeOnSession(sessionId: string, methodName: string, payload: any): Promise<any> {
        // Construct session resource URL
        // Explicitly handle if sessionId is a full path or just ID
        let resourceUrl = this.baseUrl;
        if (sessionId.includes('/sessions/')) {
            resourceUrl = sessionId.split(':')[0]; // Use provided full resource path
        } else {
            resourceUrl = `${this.baseUrl}/sessions/${sessionId}`;
        }

        return this.executeOnResource(resourceUrl, methodName, payload);
    }

    /**
     * Query the Reasoning Engine with session context using the standard :query endpoint
     */
    public async queryWithSession(sessionId: string, userId: string, message: string): Promise<any> {
        const token = await this.getAccessToken();
        const url = `${this.baseUrl}:streamQuery`;

        console.log(`[VertexAIService] Querying with session at ${url}`);

        const body = {
            input: {
                user_id: userId,
                session_id: sessionId,
                message: message
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[VertexAIService] Error ${response.status}: ${errorText}`);
            throw new Error(`Vertex AI API Error: ${response.statusText} - ${errorText}`);
        }

        // streamQuery returns NDJSON (newline-delimited JSON)
        const text = await response.text();

        // Parse NDJSON into array of events
        const events = text.trim().split('\n').map(line => {
            try {
                return JSON.parse(line);
            } catch (e) {
                console.error('[VertexAIService] Failed to parse line:', line);
                return null;
            }
        }).filter(event => event !== null);

        return events;
    }

    private async executeOnResource(resourceUrl: string, methodName: string, payload: any): Promise<any> {
        const token = await this.getAccessToken();
        const url = `${resourceUrl}:${methodName}`;

        console.log(`[VertexAIService] Executing method '${methodName}' at ${url}`);

        // For session-bound methods, usually we just pass the input directly?
        // Or do we still use classMethod?
        // Reasoning Engine standard is: if targeting a resource, method is the usage.
        // We probably don't need `classMethod` if we are calling a standard method like `:query`.
        // BUT if it's a custom method on the session object?

        // Let's assume standard API payload structure: { input: ... }
        const body = {
            input: payload
        };
        // Note: We removed `classMethod` here because usually sub-resource methods are real API methods.
        // If it fails, we can add it back.

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[VertexAIService] Error ${response.status}: ${errorText}`);
            throw new Error(`Vertex AI API Error: ${response.statusText} - ${errorText}`);
        }

        // Handle streaming response? (NDJSON)
        // For now assume JSON.
        return await response.json();
    }
}
