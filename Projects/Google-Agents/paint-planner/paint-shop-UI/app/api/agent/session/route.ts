
import { NextRequest, NextResponse } from 'next/server';
import { VertexAIService } from '@/app/services/vertex';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const userId = body.userId || `user-${Date.now()}`; // Or get from auth

        // Call create_session
        const service = VertexAIService.getInstance();

        // Payload matches Python: remote_app.create_session(user_id="...")
        const payload = {
            user_id: userId
        };

        const result = await service.execute('create_session', payload);

        console.log('[Session Route] Session created:', JSON.stringify(result));

        // Result likely contains the session object: { name: "...", ... } or { id: "..." }
        // We'll return it to the client
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('[Session Route] Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
