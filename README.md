# Library Book Management API

A RESTful API for managing a library book system, built with Express.js and TypeScript.

## Features

- Complete CRUD operations for books
- Input validation and error handling
- Rate limiting and security middleware
- API documentation with Swagger
- Unit tests with Jest
- Docker support for development and production

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`

### Running the API

#### Using Node.js

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

#### Using Docker

```bash
# Development mode
docker-compose up api-dev

# Production mode
docker-compose up api-prod

# Run tests
docker-compose up api-test
```

## API Documentation

The API documentation is available at `http://localhost:3000/api-docs` when the server is running.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /books   | Get all books |
| GET    | /books/:id | Get a book by ID |
| POST   | /books   | Create a new book |
| PUT    | /books/:id | Update a book |
| DELETE | /books/:id | Delete a book |

## Testing

```bash
npm test
```

## Project Structure

```
├── src/
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Data models
│   ├── routes/           # Express routes
│   ├── tests/            # Test files
│   ├── validation/       # validation files
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
├── jest.config.js        # Jest configuration
└── tsconfig.json         # TypeScript configuration
```