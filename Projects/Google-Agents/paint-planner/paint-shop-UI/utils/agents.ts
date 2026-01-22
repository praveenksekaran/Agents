
import { Room, PaintProduct } from '@/types';

export interface AgentMessage {
    id: string;
    sender: 'user' | 'agent';
    agentName?: string;
    text: string;
    timestamp: number;
    isThinking?: boolean;
}

export class AgentSystem {
    private history: AgentMessage[] = [];
    private listeners: ((messages: AgentMessage[]) => void)[] = [];
    private API_URL = process.env.Agent_Query_URL;
    private sessionId: string | null = null;
    private userId: string = 'user-generic'; // Hardcoded for simplified session mgmt

    constructor(initialRooms: Room[], initialPaints: PaintProduct[]) {
        // Constructor signature kept for compatibility
    }

    public subscribe(listener: (messages: AgentMessage[]) => void) {
        this.listeners.push(listener);
        listener([...this.history]);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify() {
        this.listeners.forEach(l => l([...this.history]));
    }

    public addMessage(sender: 'user' | 'agent', text: string, agentName: string = 'Agent', isThinking: boolean = false) {
        const msg: AgentMessage = {
            id: Math.random().toString(36).substring(7),
            sender,
            agentName,
            text,
            timestamp: Date.now(),
            isThinking
        };
        this.history.push(msg);
        this.notify();
    }

    public updateContext(updates: any) {
    }

    public updateRooms(rooms: Room[]) {
    }

    private async createSession() {
        try {
            const res = await fetch('/api/agent/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: this.userId })
            });
            if (!res.ok) throw new Error(await res.text());
            return await res.json();
        } catch (e) {
            console.error("Session creation failed", e);
            return { error: true, text: "Failed to connect to agent." };
        }
    }

    private async queryAgent(text: string) {
        if (!this.sessionId) return { error: true, text: "No active session." };

        try {
            const res = await fetch('/api/agent/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: this.sessionId,
                    userId: this.userId,
                    message: text
                })
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Query failed: ${errText}`);
            }
            return await res.json();
        } catch (e: any) {
            console.error("Query failed", e);
            return { error: true, text: `Error: ${e.message}` };
        }
    }

    private removeThinkingMessages() {
        this.history = this.history.filter(m => !m.isThinking);
    }

    public async start() {
        this.addMessage('agent', "Connecting to Vertex AI Agent...", 'System', true);

        const sessionData = await this.createSession();
        console.log("Session Data:", sessionData);
        // Check for direct ID or nested output structure (common in Reasoning Engine responses)
        const sId = sessionData.id || sessionData.name || (sessionData.session && sessionData.session.id) || (sessionData.output && sessionData.output.id);

        if (sId) {
            this.sessionId = sId;
            console.log("Session Created:", this.sessionId);
            // Send initial greeting
            await this.handleUserMessage("Hi", true);
        } else {
            this.removeThinkingMessages();
            this.addMessage('agent', "Failed to initialize session.", 'System');
            console.error("Invalid session data:", sessionData);
        }
    }

    public async handleUserMessage(text: string, automated: boolean = false) {
        if (!automated) {
            this.addMessage('user', text);
        }
        this.addMessage('agent', "Thinking...", 'Agent', true);

        const response = await this.queryAgent(text);

        this.removeThinkingMessages();

        // Parse list of events from stream_query?
        // If response is array of events, we extract text
        const replyText = this.parseResponse(response);
        this.addMessage('agent', replyText, 'Agent');
    }

    public async triggerPlanner(floorPlanData?: any) {
        if (floorPlanData) {
            const jsonString = JSON.stringify(floorPlanData, null, 2);
            const message = `I have completed the floor plan layout. Here is the detailed room data:\n\n${jsonString}`;
            await this.handleUserMessage(message);
        } else {
            await this.handleUserMessage("I have completed the floor plan layout.");
        }
    }

    private parseResponse(data: any): string {
        if (data.text) return data.text;
        if (data.output) return data.output;
        if (data.result) return data.result;

        // Python `stream_query` returns events with nested content.
        // If we used `query`, it might return a simpler structure.
        // If data is array (stream events aggregated?), join them?
        if (Array.isArray(data)) {
            return data.map(d => this.parseResponse(d)).join('\n');
        }

        if (typeof data === 'string') return data;
        return JSON.stringify(data, null, 2);
    }
}
