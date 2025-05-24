"""
Defines Pydantic models for the chat API endpoint.

These models validate and structure the incoming chat message
from the client and the server's response back to the client.

All models must follow type-safe design and include relevant
documentation for maintainability and clarity.
"""

from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    """
    Schema for incoming chat messages from the frontend.

    Attributes:
        message (str): The user's message input to the chat system.

    Security:
        Input will be sanitized before processing.
    """
    message: str = Field(..., min_length=1, max_length=1000, example="Hello, how can I reset my password?")


class ChatResponse(BaseModel):
    """
    Schema for chat responses returned to the client.

    Attributes:
        reply (str): The AI or system-generated response to the input message.
    """
    reply: str = Field(..., example="Sure, here's how you can reset your password...")
