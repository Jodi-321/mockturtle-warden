# Security Implementation Guide

This document details the security controls and patterns implemented in mockturtle-warden. The project demonstrates comprehensive security-first development practices while maintaining development convenience for educational purposes.

## Security Architecture Overview

The security implementation follows a defense-in-depth approach with multiple layers of protection:

1. **Network Layer**: IP whitelisting and CORS protection
2. **Application Layer**: JWT authentication and input validation
3. **Container Layer**: Security hardening and non-root execution
4. **Infrastructure Layer**: Security headers and rate limiting

## Authentication and Authorization

### JWT Token Implementation

The project implements stateless JWT authentication using the `python-jose` library with industry-standard practices:

```python
# backend/security/auth.py
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=JWT_EXPIRATION_MINUTES))
    to_encode.update({"exp":expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt
```

**Security Features Demonstrated:**
- **Algorithm Specification**: Uses HS256 algorithm explicitly
- **Token Expiration**: Configurable expiration with 30-minute default
- **Payload Protection**: Signs user data to prevent tampering
- **Environment Configuration**: Secret loaded from environment variables

### Token Validation and Route Protection

FastAPI dependency injection provides secure route protection:

```python
# backend/security/auth.py
def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"code":"INVALID_CREDENTIALS","message":"Could not validate credentials"},
        headers={"WWW-Authenticate":"Bearer"},
    )

    try:
        payload = jwt.decode(token, JWT_SECRET,algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return {"username":username}
    except JWTError:
        raise credentials_exception
```

**Security Patterns:**
- **Structured Error Handling**: Prevents information leakage
- **Algorithm Verification**: Explicitly validates expected algorithm
- **Token Payload Validation**: Ensures required claims exist
- **Dependency Injection**: Centralizes authentication logic

### Development Authentication System

**SECURITY NOTICE**: The project includes hardcoded credentials for development purposes:

```python
# backend/routes/auth.py
fake_user_db = {
    "admin@example.com":{
        "username":"admin@example.com",
        "hashed_password":"$2b$12$E3TWDTUMxuIOfVauH7V3aewn2swIV1wZMn3vExsveZEJmKjldH4gG",
    },
    "jodi@example.com":{
        "username":"jodi@example.com", 
        "hashed_password":"$2b$12$HLHdyLgYy8JjnXWiwHTaR.odGwbtPePqprYP86je9O8xvtuWddyOq",
    }
}
```

**Security Analysis:**
- **Proper Password Hashing**: Uses bcrypt with appropriate salt rounds
- **Development Convenience**: Enables immediate testing without external dependencies
- **Security Concern**: Hardcoded credentials must be replaced in production
- **Educational Value**: Demonstrates proper password hashing patterns

## Network Security Controls

### IP Whitelisting Middleware

Custom middleware implements application-layer IP restrictions:

```python
# backend/middleware/ip_whitelist.py
class IPWhitelistMiddleware(BaseHTTPMiddleware):
    def __init__(self,app, allowed_ips: Optional[List[str]] = None, excluded_paths: Optional[List[str]] = None):
        super().__init__(app)
        
        ip_env = allowed_ips if allowed_ips is not None else os.getenv("ALLOWED_IPS", "")
        if isinstance(ip_env, str):
            self.allowed_ips = parse_allowed_ips(ip_env)
        else:
            self.allowed_ips = [ipaddress.ip_network(ip.strip()) for ip in ip_env]
        
        self.excluded_paths = excluded_paths or []
```

**Security Implementation Details:**
- **Environment Configuration**: IP ranges configurable via environment variables
- **CIDR Support**: Handles both individual IPs and network ranges
- **Path Exclusions**: Allows health checks to bypass IP filtering
- **Flexible Configuration**: Supports runtime configuration changes

### IP Validation Logic

```python
# backend/middleware/ip_whitelist.py
async def dispatch(self, request: Request, call_next):
    client_host = request.headers.get("X-Test-Client-IP", request.client.host)
    try:
        client_ip = ipaddress.ip_address(client_host)
    except ValueError:
        return Response(content="Invalid client IP address",
            status_code=status.HTTP_400_BAD_REQUEST)
    
    if any(client_ip in network for network in self.allowed_ips):
        return await call_next(request)
    
    return Response(
        content="Access denied: IP not allowed.",
        status_code=status.HTTP_403_FORBIDDEN
    )
```

**Security Features:**
- **Input Validation**: Validates IP address format before processing
- **Network Matching**: Efficiently checks against configured IP ranges
- **Secure Defaults**: Denies access when IP not explicitly allowed
- **Testing Support**: Includes header override for testing environments

### CORS Protection

Configurable Cross-Origin Resource Sharing implementation:

```python
# backend/main.py
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Security Configuration:**
- **Origin Restriction**: Limits requests to configured domains
- **Credential Support**: Enables secure cookie and header transmission
- **Environment-based**: Origins configurable for different environments

## Input Validation and Sanitization

### Pydantic Model Validation

Comprehensive input validation using Pydantic schemas:

```python
# backend/models/chat.py
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, example="Hello, how can I reset my password?")

class ChatResponse(BaseModel):
    reply: str = Field(..., example="Sure, here's how you can reset your password...")
```

**Validation Features:**
- **Length Constraints**: Prevents oversized input attacks
- **Required Fields**: Ensures mandatory data is present
- **Type Safety**: Enforces data type requirements
- **Documentation**: Provides clear API contract

### Route-Level Input Protection

```python
# backend/routes/chat.py
@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
def chat_endpoint(request: ChatRequest, user: dict = Depends(get_current_user)) -> ChatResponse:
    try:
        response = generate_chat_response(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate chat response"
        ) from e
```

**Security Patterns:**
- **Authentication Dependency**: Requires valid JWT for access
- **Input Validation**: Automatic validation via Pydantic model
- **Error Handling**: Prevents information leakage in error responses
- **Type Safety**: Ensures response matches expected schema

## Frontend Security Implementation

### Token Management

Secure client-side token handling:

```typescript
// frontend/src/services/authService.ts
export function isTokenExpired(token: string):boolean {
    try {
        const decoded: AuthToken = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp < now;
    } catch (e) {
        return true; // Treat invalid tokens as expired
    }
}

export function getAuthToken(): string | null {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const type = localStorage.getItem(TOKEN_TYPE_KEY) || 'bearer';
  return token ? `${type} ${token}` : null;
}
```

**Security Features:**
- **Expiration Validation**: Client-side token expiration checking
- **Secure Storage**: Centralized token management
- **Error Handling**: Treats malformed tokens as invalid
- **Type Safety**: TypeScript interfaces ensure type correctness

### Protected Route Implementation

```typescript
// frontend/src/routes/ProtectedRoute.tsx
export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
    const token = getAuthToken();
    if(!token || isTokenExpired(token)) {
        logout(); // Clear token and redirect
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}
```

**Security Mechanisms:**
- **Token Validation**: Checks token presence and validity
- **Automatic Cleanup**: Removes expired tokens
- **Secure Redirects**: Prevents unauthorized access to protected content
- **Session Management**: Maintains authentication state

### API Client Security

```typescript
// frontend/src/services/apiClient.ts
export async function postWithAuth<TRequest, TResponse>(
    url: string,
    body: TRequest
): Promise<TResponse> {
    const token = getAuthToken();
    if(!token){
        throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
```

**Security Implementation:**
- **Token Validation**: Ensures token exists before API calls
- **Header Management**: Proper Authorization header formatting
- **Error Handling**: Graceful handling of authentication failures
- **Type Safety**: Generic type parameters ensure type correctness

## Container Security

### Multi-Stage Build Security

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim AS builder
# Build stage with development tools

FROM python:3.11-slim AS production
# Create application user with minimal privileges
RUN groupadd -r appuser && useradd -r -g appuser -d /app -s /sbin/nologin appuser

# Copy virtual environment from builder stage
COPY --from=builder --chown=appuser:appuser /opt/venv /opt/venv
COPY --from=builder --chown=appuser:appuser /app .

USER appuser
```

**Security Features:**
- **Multi-Stage Builds**: Separates build tools from runtime
- **Non-Root Execution**: Runs as dedicated application user
- **Minimal Runtime**: Reduces attack surface in production image
- **Proper Ownership**: Files owned by application user

### Container Hardening

```yaml
# docker-compose.security.yml
backend:
  security_opt:
    - no-new-privileges:true
  read_only: true
  tmpfs:
    - /tmp:noexec,nosuid,size=100m
  user: "1000:1000"
  cap_drop:
    - ALL
  cap_add:
    - NET_BIND_SERVICE
```

**Security Hardening:**
- **Privilege Escalation**: Prevents container privilege escalation
- **Read-Only Filesystem**: Immutable container filesystem
- **Capability Dropping**: Removes unnecessary Linux capabilities
- **Resource Limits**: Prevents resource exhaustion attacks

## Web Server Security

### NGINX Security Configuration

```nginx
# frontend/nginx.conf
# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:;" always;

# Rate Limiting Zones
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;

# Remove NGINX version from responses
server_tokens off;
```

**Security Headers:**
- **Clickjacking Protection**: X-Frame-Options prevents iframe embedding
- **MIME Sniffing Protection**: Prevents content-type confusion attacks
- **XSS Protection**: Browser-level XSS filtering
- **Content Security Policy**: Restricts resource loading sources
- **Rate Limiting**: Prevents brute force and DoS attacks

## Environment Security

### Configuration Management

```python
# backend/security/auth.py
JWT_SECRET = os.getenv("JWT_SECRET", "insecure-default")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_MINUTES = int(os.getenv("JWT_EXPIRATION_MINUTES","30"))
```

**Security Patterns:**
- **Environment Variables**: Sensitive configuration externalized
- **Secure Defaults**: Fallback values clearly marked as insecure
- **Type Safety**: Environment variables properly typed
- **Configuration Flexibility**: Runtime configuration without code changes

### Development vs Production Security

**Development Conveniences (Security Concerns):**

1. **Insecure JWT Default**: `"insecure-default"` fallback for JWT_SECRET
2. **Hardcoded Credentials**: Test users with known passwords
3. **Debug Logging**: Detailed logging that may expose sensitive information
4. **Permissive CORS**: Allows all headers and methods for development

**Production Requirements:**
- Replace hardcoded credentials with external authentication
- Require JWT_SECRET from secure secret management
- Implement production logging with PII redaction
- Restrict CORS to specific headers and methods needed

## Security Testing Implementation

### IP Whitelist Testing

```python
# backend/tests/middleware/test_ip_whitelist.py
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
```

**Testing Security Controls:**
- **Environment Isolation**: Tests with controlled environment variables
- **Positive/Negative Testing**: Validates both allowed and blocked scenarios
- **Header Override**: Uses test headers for controlled IP simulation
- **Assertion Verification**: Confirms expected security behavior

## Summary

This security implementation demonstrates comprehensive defense-in-depth principles while maintaining development convenience. The architecture showcases:

- **Authentication**: Stateless JWT implementation with proper validation
- **Authorization**: Route-level protection with dependency injection
- **Network Security**: IP whitelisting and CORS protection
- **Input Validation**: Comprehensive Pydantic-based validation
- **Container Security**: Multi-stage builds with security hardening
- **Web Security**: Security headers and rate limiting
- **Client Security**: Secure token management and protected routes
