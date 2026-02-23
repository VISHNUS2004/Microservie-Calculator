# Calculator Microservices

Simple calculator application built with Node.js microservices and an API gateway.

## Services

- API Gateway: `http://localhost:3000`
- Add service: `http://localhost:3001`
- Subtract service: `http://localhost:3002`
- Multiply service: `http://localhost:3003`
- Divide service: `http://localhost:3004`
- Frontend UI is served by the gateway at `http://localhost:3000`

## Run Locally (Recommended)

1. Install dependencies:

```bash
npm install
npm --prefix gateway install
npm --prefix services/add install
npm --prefix services/subtract install
npm --prefix services/multiply install
npm --prefix services/divide install
```

2. Start all services:

```bash
npm start
```

3. Open the app:

- `http://localhost:3000`

## API

### POST `/api/calculate`

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

Sample error response (divide by zero):

```json
{
  "error": "Cannot divide by zero."
}
```

## Docker Compose (Current Status)

`docker-compose.yml` is present, but the current gateway code uses `localhost` for internal service calls and the gateway image does not include the `frontend` folder.

Because of that, Compose does not currently provide a fully working end-to-end app without code changes.
