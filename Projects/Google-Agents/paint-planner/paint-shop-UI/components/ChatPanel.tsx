
'use client';

import { useState, useRef, useEffect } from 'react';
import { AgentMessage } from '@/utils/agents';

interface ChatPanelProps {
    messages: AgentMessage[];
    onSendMessage: (text: string) => void;
}

export default function ChatPanel({ messages, onSendMessage }: ChatPanelProps) {
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim()) {
            onSendMessage(inputText.trim());
            setInputText('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white border-l border-gray-200 shadow-xl w-96 max-w-md">
            {/* Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span>🤖</span> AI Assistant
                </h2>
                <p className="text-xs text-gray-500">Powered by Agent System</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-500">
                                {msg.sender === 'user' ? 'You' : msg.agentName || 'Agent'}
                            </span>
                        </div>

                        <div
                            className={`p-3 rounded-2xl max-w-[90%] shadow-sm ${msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                }`}
                        >
                            {msg.isThinking ? (
                                <div className="flex items-center gap-2 text-gray-500 italic">
                                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                                    {msg.text}
                                </div>
                            ) : (
                                <div className="whitespace-pre-wrap text-sm">{msg.text}</div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={!inputText.trim()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}
