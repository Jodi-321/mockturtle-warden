'''
Pydantic models for authnetication-related schemas
'''

from pydantic import BaseModel

class Token(BaseModel):
    '''
    Represents the structure of a successful JWT response
    '''
    access_token: str
    token_type: str

class TokenData(BaseModel):
    '''
    Payload structure extracted from JWT
    '''
    sub: str