'''
Authentication utilities for issuing and validating JWT tokens

Security:
- JWT is signed using HS256 algorithm
- OAuth2PasswordBearer is used for taoken parsing
- Secrets are loaded form envrionment variables (AWS secrets manager is future state)
'''

import os
from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv

from models.auth import TokenData

# Load environemnt variables
load_dotenv()

# Environment-based settings
JWT_SECRET = os.getenv("JWT_SECRET", "insecure-default")
# Replace in production
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_MINUTES = int(os.getenv("JWT_EXPIRATION_MINUTES","30"))

# OAuth2 bearer scheme for token parsing
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    '''
    Generate a JWT access token with optional expiration override.

    Args:
        data: The payload to include in the token (e.g., {"sub":"user@example"}).
        expires_delta: Optional timedelta for custom token expiration

    Returns:
        A signed JWT string
    '''

    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=JWT_EXPIRATION_MINUTES))
    to_encode.update({"exp":expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    '''
    Decode and validate the JWT token provided by the user

    Args:
        token: The JWT token from the Authorization header

    Returns:
        The decoded token payload

    Raises:
        HTTPException: If th etoken is invalid or expired
    '''

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"code":"INVALID_CREDENTIALS","message":"Could not validate credentials"},
        headers={"WWW-Authenticate":"Bearer"},
    )

    try:
        payload = jwt.decode(token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentails_exception
        return {"username":username}
    except JWTError:
        raise credentials_exception