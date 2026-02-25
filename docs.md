# Calculator Microservices Documentation

A simple calculator application implemented with **Node.js microservices** and an **API Gateway**.

The gateway receives calculation requests and routes them to one of four operation services:

- Add
- Subtract
- Multiply
- Divide

It also serves the frontend UI.

---

## Why Microservice Architecture for This Calculator

This calculator was integrated with a microservice architecture to demonstrate how a simple product can be split into focused, independent services.

- **Separation of concerns:** each operation (add, subtract, multiply, divide) is isolated in its own service.
- **Independent scaling:** high-usage operations can be scaled without scaling the entire application.
- **Fault isolation:** failure in one operation service is less likely to bring down all functionality.
- **Team-friendly development:** different services can be developed, tested, and deployed independently.
- **Extensibility:** new operations (for example, power, modulus, square root) can be added as new services with minimal impact.
- **Real-world learning value:** this structure mirrors patterns used in production distributed systems.

For this project, microservices are used primarily as an architectural learning and demonstration approach rather than a strict complexity requirement for a basic calculator.

---

## What Is Microservice Architecture?

Microservice architecture is a software design style where an application is built as a collection of small, independent services. Each service is focused on one business capability, communicates through APIs, and can be developed, deployed, and scaled separately.

In contrast to a monolith (single large codebase/process), microservices split responsibilities into multiple services that collaborate.

### Core Components of Microservice Architecture

- **Client / Frontend**
  - The user-facing app that sends requests.
  - In this project: `frontend/index.html`.

- **API Gateway (or Edge Service)**
  - Single entry point for clients.
  - Handles routing, validation, aggregation, and response formatting.
  - In this project: `gateway/server.js`.

- **Business Microservices**
  - Independent services, each owning one capability.
  - In this project: add, subtract, multiply, divide services.

- **Inter-service Communication**
  - HTTP/REST, gRPC, or messaging used for service-to-service interaction.
  - In this project: synchronous HTTP calls from gateway to each service.

- **Service Discovery / Addressing**
  - Mechanism to locate services (DNS, registry, orchestration networking).
  - In this project: localhost addresses for local run.

- **Data Ownership (Typical Pattern)**
  - Each microservice ideally owns its own data store and schema.
  - Not used in this calculator because no persistent storage is required.

- **Observability (Typical Pattern)**
  - Centralized logging, metrics, health checks, tracing.
  - In this project: health endpoints exist; centralized logs/tracing are future improvements.

- **Deployment & Orchestration (Typical Pattern)**
  - Containers and orchestrators (Docker, Kubernetes, etc.) for independent deployment.
  - In this project: `docker-compose.yml` is present, with noted limitations.

---

## Architecture

### Components

- **Frontend** (`frontend/index.html`)
  - Browser UI for entering numbers and operation
  - Sends requests to `POST /api/calculate` on the gateway

- **API Gateway** (`gateway/server.js`) — `http://localhost:3000`
  - Serves frontend static files
  - Validates input (`operation`, `a`, `b`)
  - Calls the correct operation microservice
  - Returns unified JSON responses

- **Operation Microservices**
  - Add service — `http://localhost:3001`
  - Subtract service — `http://localhost:3002`
  - Multiply service — `http://localhost:3003`
  - Divide service — `http://localhost:3004`

### Request Flow

1. User clicks **Calculate** in frontend
2. Frontend calls `POST /api/calculate` on gateway
3. Gateway forwards to target service `/calculate`
4. Service computes and responds with `{ "result": ... }`
5. Gateway returns final response to frontend

---

## Project Structure

```text
calculator-microservices/
├── docker-compose.yml
├── package.json
├── frontend/
│   └── index.html
├── gateway/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
└── services/
    ├── add/
    ├── subtract/
    ├── multiply/
    └── divide/
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (Node 20 recommended)
- npm
- (Optional) Docker Desktop for containerized runs

---

## Run Locally (Recommended)

This is the currently working end-to-end setup.

### 1) Install dependencies

From project root:

```bash
npm install
npm --prefix gateway install
npm --prefix services/add install
npm --prefix services/subtract install
npm --prefix services/multiply install
npm --prefix services/divide install
```

### 2) Start all services

```bash
npm start
```

This starts gateway + all microservices concurrently.

### 3) Open the app

- UI: `http://localhost:3000`

---

## API Documentation

### Gateway Endpoint

#### `POST /api/calculate`

Route: `http://localhost:3000/api/calculate`

Request body:

```json
{
  "operation": "add",
  "a": 10,
  "b": 5
}
```

Supported operations:

- `add`
- `subtract`
- `multiply`
- `divide`

Success response:

```json
{
  "operation": "add",
  "a": 10,
  "b": 5,
  "result": 15
}
```

Validation errors:

- Invalid operation:

```json
{
  "error": "Invalid operation. Use add, subtract, multiply, or divide."
}
```

- Invalid numeric fields:

```json
{
  "error": "Fields 'a' and 'b' must be numbers."
}
```

- Divide by zero (from divide service):

```json
{
  "error": "Cannot divide by zero."
}
```

- Upstream service unavailable:

```json
{
  "error": "Operation service unavailable.",
  "detail": "..."
}
```

---

## Health Endpoints

- Gateway: `GET http://localhost:3000/health`
- Add: `GET http://localhost:3001/health`
- Subtract: `GET http://localhost:3002/health`
- Multiply: `GET http://localhost:3003/health`
- Divide: `GET http://localhost:3004/health`

Each service returns a JSON object like:

```json
{
  "service": "add",
  "status": "ok"
}
```

---

## Test with cURL

```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d "{\"operation\":\"multiply\",\"a\":6,\"b\":7}"
```

Expected result:

```json
{
  "operation": "multiply",
  "a": 6,
  "b": 7,
  "result": 42
}
```

---

## Docker Compose Status

`docker-compose.yml` is included, but the current code is **not fully container-ready** for end-to-end usage.

### Known limitations

1. **Gateway service URLs use `localhost`**
   - In containers, `localhost` refers to the gateway container itself, not other services.
   - Service calls should use container DNS names (for example, `http://add-service:3001`).

2. **Gateway image does not include frontend files**
   - `gateway/Dockerfile` only copies `server.js` and package files.
   - `frontend/index.html` is not copied into image, so UI serving will fail in container mode.

Because of the above, local Node execution (`npm start`) is the recommended way to run this project currently.

---

## Troubleshooting

- **Port already in use**
  - Stop processes using ports 3000–3004 or change ports in service files.

- **`npm start` fails immediately**
  - Ensure all dependencies were installed in root and each subproject.

- **Frontend says gateway unreachable**
  - Confirm gateway is running on port 3000.
  - Check terminal logs for startup or runtime errors.

---

## Tech Stack

- Node.js
- Express
- Axios (gateway-to-service calls)
- CORS
- Concurrently (for local multi-process startup)

---

## Future Improvements

- Make Docker Compose fully functional by:
  - Switching gateway internal URLs from `localhost` to Compose service names
  - Updating gateway Dockerfile to copy frontend assets
- Add centralized logging and request IDs
- Add automated tests (unit + integration)
