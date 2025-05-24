'''
Provides the buisness logic for processing chat messages

This layer handles all server-side reasoning and prepares responses 
to be returned via the chat route. It is designed to be easily
extended with AI model integration in the future
'''

from typing import Optional
from models.chat import ChatRequest, ChatResponse

def generate_chat_response(request: ChatRequest) -> ChatResponse:
    '''
    Generates a chat response based on the suer's input message

    This function servers as the abstraction point for how the system intreprets 
    and responds to incoming chat messages. 
    Currently, it returns a placeholder echo-style reply for MVP testing

    Args:
        request (ChatRequest): The validated chat message from the client

    Returns:
        ChatResponse: The structured response message to be returned.

    Security:
        This layer does not modify input; sanitization occurs earlier in 
        the request lifecycle if needed.
    '''

    user_message = request.message.strip()

    # Placeholder logic: echo the user's message with a canned prefix
    response_text = f"You said: {user_message}"

    return ChatResponse(reply=response_text)