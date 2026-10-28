# Configuration and Deployment Guide

## Environment Variables

- NODE_ENV: development, test, or production
- PORT: Server port (1–65535)
- MONGO_URI: MongoDB connection string
- JWT_SECRET: Authentication signing secret
- BASE_URL: Public backend URL
- FRONTEND_URL: Optional frontend URL
- CORS_ORIGIN: Allowed frontend origin

## Development Setup

1. Install Node.js and MongoDB.
2. Copy .env.example to .env.
3. Configure the environment variables.
4. Run the application using the team's backend instructions.

## Production Security

- Set NODE_ENV=production.
- Use a unique JWT_SECRET of at least 32 characters.
- Use HTTPS for BASE_URL and FRONTEND_URL.
- Configure an explicit CORS_ORIGIN.
- Never commit .env or credentials.
- Use a secured MongoDB connection.

## Configuration Validation

The validator is located at config/validateEnv.js.

The backend should load environment variables, then call
validateEnv(process.env) before starting the server.

This integration must be completed when the backend is merged.

## Automated Tests

Run:

    node --test tests/validateEnv.test.js

Eight tests cover development settings, production settings,
invalid ports, MongoDB configuration, secrets, and HTTPS.
