'''
Defines authentication routes for suer login and token issuance
'''

from fastapi import APIRouter, Form, HTTPException, status
from models.auth import Token
from security.auth import create_access_token
from passlib.hash import bcrypt

router = APIRouter()

# Temporary hardcoded credentials for testing
fake_user_db = {
    "admin@example.com":{
        "username":"admin@example.com",
        "hashed_password":"$2b$12$E3TWDTUMxuIOfVauH7V3aewn2swIV1wZMn3vExsveZEJmKjldH4gG", # For testing purposes only
    },
    "jodi@example.com":{
        "username":"jodi@example.com",
        "hashed_password":"$2b$12$HLHdyLgYy8JjnXWiwHTaR.odGwbtPePqprYP86je9O8xvtuWddyOq", # For testing purposes only
    }
}


@router.post("/token", response_model=Token, tags=["Auth"])
def login_for_access_token(
    username: str =  Form(...),
    password: str = Form(...)
):
    '''
    Verifies the username and password, then issues a JWT token

    Args:
        username: User-provided username
        password: User-provdied password.

    Returns:
        A signed JWT token with type "bearer"
    '''

    print(f"Username:{username}, Password:{password}") #Debug statement - not needed

    user = fake_user_db.get(username)
    if not user or not bcrypt.verify(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="incorrect username or password",
        )
    
    access_token = create_access_token(data={"sub":user["username"]})
    return {"access_token": access_token, "token_type":"bearer"}
