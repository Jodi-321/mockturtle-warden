'''
Middleware to restrict access to allowed IP addresses only
'''

import os
import ipaddress
from fastapi import Request, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from utils.ip_utils import parse_allowed_ips
from typing import Optional, List

class IPWhitelistMiddleware(BaseHTTPMiddleware):
    '''
    FastAPI middleware to restrict incoming requests to allowed IPs
    '''

    def __init__(self,app, allowed_ips: Optional[List[str]] = None, excluded_paths: Optional[List[str]] = None):
        super().__init__(app)
        
        # Fallback to environemnt variable if not passed explicitly
        ip_env = allowed_ips if allowed_ips is not None else os.getenv("ALLOWED_IPS", "")
        if isinstance(ip_env, str):
            self.allowed_ips = parse_allowed_ips(ip_env)
        else:
            self.allowed_ips = [ipaddress.ip_network(ip.strip()) for ip in ip_env]
        #self.allowed_ips = parse_allowed_ips(ip_env) if isinstance(ip_env, str) else [
        #    ipaddress.ip_network(ip.strip()) for ip in ip_env
        #]
        #self.allowed_ips = parse_allowed_ips(ip_env)
        self.excluded_paths = excluded_paths or []

        print(f"[INIT DEBUG] ALLOWED_IPS parsed: {self.allowed_ips}")
    
    async def dispatch(self, request: Request, call_next):
        # Use X-Test-Client-IP for testing, fallback to actual client host
        client_host = request.headers.get("X-Test-Client-IP", request.client.host)
        try:
            client_ip = ipaddress.ip_address(client_host)
        except ValueError:
            return Response(content="Invalid client IP address",
                status_code=status.HTTP_400_BAD_REQUEST)
        
        #client_ip = ipaddress.ip_address(request.client.host)
        request_path = request.url.path

        # Allow excluded paths (like /health) to bypass IP filtering
        if request_path in self.excluded_paths:
            return await call_next(request)
        
        #raw_ip = request.client.host

        # handling for Startletter TestClient in test env
        #if raw_ip == "testclient":
        #    raw_ip = "127.0.0.1"
        '''
        try:
            client_ip = ipaddress.ip_address(raw_ip)
        except ValueError:
            return Response(
                content=f"Invalid client IP: {raw_ip}",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        '''
        
        # Debug Statements -- remove before production
        print(f"[DEBUG] Incoming client IP: {client_ip}")
        print(f"[DEBUG] Request path: {request_path}")
        print(f"[DEBUG] Allowed networks: {self.allowed_ips}")
        print(f"[DEBUG] Access granted: {any(client_ip in network for network in self.allowed_ips)}")

        if any(client_ip in network for network in self.allowed_ips):
            return await call_next(request)
        
        return Response(
            content="Access denied: IP not allowed.",
            status_code=status.HTTP_403_FORBIDDEN
        )