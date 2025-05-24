'''
Test cases for IP whitelist middleware
'''

import os
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from middleware.ip_whitelist import IPWhitelistMiddleware

# Import route module to attach to fresh app instance
from routes import chat, auth

def create_test_app():
    app = FastAPI()
    app.include_router(chat.router)
    app.include_router(auth.router)

    # Exclude health check from IP block for both tests
    app.add_middleware(IPWhitelistMiddleware)

    @app.get("/health")
    def health_check():
        return {"status":"ok"}
    
    return app

'''
@pytest.fixture(autouse=True)
def set_allowed_ips(monkeypatch):
    monkeypatch.setenv("ALLOWED_IPS","127.0.0.1")
'''


def test_request_from_allowed_ip(monkeypatch):
    monkeypatch.setenv("ALLOWED_IPS", "127.0.0.1")
    app = create_test_app()
    client = TestClient(app)
    response = client.get("/health", headers={"X-Test-Client-IP": "127.0.0.1"})
    assert response.status_code == 200

def test_request_from_blocked_ip(monkeypatch):
    monkeypatch.setenv("ALLOWED_IPS","10.10.10.10")
    app = create_test_app()
    client = TestClient(app)
    response = client.get("/health", headers={"X-Test-Client-IP": "127.0.0.1"})
    assert response.status_code == 403
    assert b"Access denied" in response.content
