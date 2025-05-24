'''
Defines the chat API route for handling POST requests from the frontend

This module accepts a validated chat message from the client, delegates processing 
to the chat engine service, and returns a structured response.

enhancements:
- implemented: JWT-based authentication using FastAPI's dependency system
- future: Log user activity and message data (without storing PII)
'''

from fastapi import APIRouter, Depends, status, HTTPException
from models.chat import ChatRequest, ChatResponse
from services.chat_engine import generate_chat_response
from security.auth import get_current_user

router = APIRouter()

@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Generate a chat response",
    status_code=status.HTTP_200_OK,
    tags=["Chat"]
)
def chat_endpoint(request: ChatRequest,
                  user: dict = Depends(get_current_user)
) -> ChatResponse:
    '''
    Handles chat requests by forwarding the user's message to the 
    chat engine and returning a structured response.

    Args:
        request (ChatRequest): The incoming chat message from the client
        user (dict): The decoded user payload form the JWT token

    Returns:
        ChatResponse: The AI-generated or system-generated reply.

    Raises:
        HTTPException: If the response could not be generated.

    Security:
        - Protected using JWT authentication via dependency injection
    '''

    try:
        response = generate_chat_response(request)
        return response
    except Exception as e:
        # In production, this would be logged using a logging utility
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate chat response"
        ) from e