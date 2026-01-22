
import { NextRequest, NextResponse } from 'next/server';
import { VertexAIService } from '@/app/services/vertex';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sessionId, message, userId } = body;

        if (!sessionId || !message) {
            return NextResponse.json({ error: 'Missing session ID or message' }, { status: 400 });
        }

        const service = VertexAIService.getInstance();

        // Query the root agent using the streamQuery endpoint
        const events = await service.queryWithSession(sessionId, userId, message);

        console.log('[Query Route] Events received:', events.length);

        // Extract text from stream_query response
        // Response format: events[].content.parts[].text
        let responseText = '';
        if (Array.isArray(events)) {
            for (const event of events) {
                if (event?.content?.parts) {
                    for (const part of event.content.parts) {
                        if (part?.text) {
                            responseText += part.text + '\n';
                        }
                    }
                }
            }
        }

        console.log('[Query Route] Extracted text:', responseText);

        return NextResponse.json({ text: responseText.trim() || 'No response from agent' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
