# Calculator Microservices

Simple calculator app built with Node.js microservices and an API gateway.

## Quick Start

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

## Full Documentation

See [DOCUMENTATION.md](DOCUMENTATION.md) for complete architecture, API, health checks, Docker notes, and troubleshooting details.
