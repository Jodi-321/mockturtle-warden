# mockturtle-warden

Secure chat MVP platform built with React + FastAPI, designed as a foundation for future AI-enhanced moderation and communication systems. Demonstrates JWT authentication, IP whitelisting, containerization, and security-first development patterns. Development showcase - not production ready.

## Project Overview

This project serves as a foundational platform for building AI-enhanced security and moderation systems. The MVP implements essential security patterns and architectural decisions that can be extended with machine learning models, content moderation frameworks, and advanced security features.

### Architecture

- **Frontend**: React 19 with TypeScript and Vite
- **Backend**: Python FastAPI with JWT authentication
- **Security**: IP whitelisting middleware, input validation, CORS protection
- **Deployment**: Docker containerization with multi-stage builds
- **Infrastructure**: Prepared for AWS Elastic Beanstalk deployment

### Key Features

- JWT-based authentication system with OAuth2 integration
- IP whitelist middleware for access control
- Input validation and sanitization using Pydantic models
- Protected route system with automatic token management
- Containerized deployment with security hardening
- Health check endpoints for monitoring
- Comprehensive logging and error handling

## Development Showcase Notice

**IMPORTANT: This project is a development MVP designed to demonstrate secure coding patterns and architectural decisions. It is NOT intended for production use.**

### What This Project Demonstrates

- JWT-based authentication implementation
- IP whitelisting middleware
- Input validation with Pydantic
- Containerized deployment patterns
- React + FastAPI integration
- Security-first development approach

### Development Conveniences (NOT Production Ready)

#### Hardcoded Test Credentials
The project includes hardcoded user credentials in `backend/routes/auth.py` for development convenience:

```python
fake_user_db = {
    "admin@example.com": {"hashed_password": "..."}
}
```

**Purpose**: Enables immediate testing without external authentication setup  
**Production replacement**: Integrate with proper user management system (Auth0, AWS Cognito, database)

#### Fallback JWT Secret
The authentication system includes a development fallback:

```python
JWT_SECRET = os.getenv("JWT_SECRET", "insecure-default")
```

**Purpose**: Demonstrates proper environment variable usage while allowing development startup  
**Production replacement**: Require JWT_SECRET environment variable, fail if not provided

#### Debug Logging
Debug print statements throughout the codebase provide development visibility and are intentionally preserved for educational purposes.

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker and Docker Compose

### Local Development

1. Clone the repository
```bash
git clone <repository-url>
cd mockturtle-warden
```

2. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start with Docker Compose
```bash
docker-compose up --build
```

4. Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Testing

### Test Credentials
For development testing, use these credentials:
- Username: `admin@example.com`
- Password: `securepassword123`

### Running Tests
```bash
# Backend tests
cd backend
pytest tests/ -v

# Container validation
./scripts/test-containers.sh
```

## Security Features

For detailed information about the security implementations and controls, see [Security.md](Security.md).

### Security Configuration

The project includes IP whitelisting through environment variables:

```bash
ALLOWED_IPS=127.0.0.1,192.168.1.0/24
ALLOWED_ORIGINS=http://localhost:5173
JWT_SECRET=your-secret-key
```

## Deployment

### Container Deployment

The project includes optimized Docker containers with multi-stage builds:

```bash
# Build containers
docker-compose build

# Deploy with security configurations
docker-compose -f docker-compose.yml -f docker-compose.security.yml up -d
```

### AWS Elastic Beanstalk

The project is prepared for AWS deployment with:
- Elastic Beanstalk configuration
- Application Load Balancer integration
- Environment variable management
- Health check endpoints

## Future Enhancements

This platform is designed for extension with:

- AI model integration for content moderation
- Advanced threat detection and analysis
- Real-time communication features
- Advanced user management and roles
- Comprehensive audit and compliance features
- Machine learning-based security features

## License

MIT License - see LICENSE file for details.

## Acknowledgments

This project demonstrates modern web security patterns and serves as a foundation for AI-enhanced security applications. The architecture prioritizes security, scalability, and maintainability while providing clear examples of production-ready development patterns.
