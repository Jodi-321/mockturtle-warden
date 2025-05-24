/**
 * Chat.ts
 * 
 * Defines types for chat request and response
 */

export interface ChatRequest {
    message: string;
}

export interface ChatResponse {
    reply: string;
}