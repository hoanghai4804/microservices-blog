# Microservices Blog Platform

Full-stack containerized blog application built with Docker. Single entry point via Nginx reverse proxy; frontend and backend run as separate services with PostgreSQL and Redis.

---

## Tech Stack

**Frontend**
- React 18
- Axios
- CSS3

**Backend**
- Python 3.11
- FastAPI
- SQLAlchemy ORM
- Redis caching

**Data**
- PostgreSQL 15
- Redis 7

**Infrastructure**
- Docker and Docker Compose
- Nginx reverse proxy (custom image with healthcheck support)
- Multi-stage Docker builds
- Isolated networks and health checks for all services

---

## Architecture

```
Browser (http://localhost)
    |
    v
Nginx reverse proxy (port 80)
    |
    +-- /         --> Frontend container (React build served by Nginx)
    |
    +-- /api/     --> Backend container (FastAPI)
    |                   |
    |                   v
    |               PostgreSQL + Redis
    |
    +-- /health   --> Nginx health response (200)
```

**Networks**
- `frontend-net`: Nginx, Frontend, Backend (traffic from proxy to app services).
- `backend-net`: Backend, PostgreSQL, Redis (database and cache only).

**Nginx roles**
- **Reverse proxy** (`nginx/`): Single public entry (port 80); routes `/` to frontend, `/api/` to backend; exposes `/health`.
- **Static server** (`frontend/nginx.conf`): Inside frontend container; serves React build and handles SPA routing (`try_files` to `index.html`).

---

## Prerequisites

- Docker
- Docker Compose
- Git

---

## Quick Start

**Clone and configure**
```bash
git clone https://github.com/yourusername/microservices-blog.git
cd microservices-blog

cp .env.example .env
# Edit .env if you need different credentials or URLs.
```

**Start all services**
```bash
docker-compose up -d
```

**Verify**
```bash
docker-compose ps
docker-compose logs -f
```

**Access**
- Frontend: http://localhost
- API docs (Swagger): http://localhost/api/docs
- Health: http://localhost/health

---

## Services

| Service   | Container      | Port  | Image / Build                          |
|----------|----------------|-------|----------------------------------------|
| Nginx    | blog-nginx     | 80    | microservices-blog-nginx (from nginx/) |
| Frontend | blog-frontend  | (internal) | microservices-blog-frontend (from frontend/) |
| Backend  | blog-backend   | (internal) | microservices-blog-backend (from backend/)   |
| PostgreSQL | blog-postgres | 5432  | postgres:15-alpine                     |
| Redis    | blog-redis     | 6379  | redis:7-alpine                         |

Nginx starts only after frontend and backend report healthy. Frontend and backend use health checks (wget and Python respectively).

---

## Development

**Backend and infra only (frontend runs locally)**
```bash
docker-compose up -d postgres redis backend nginx
```

**Frontend dev server**
```bash
cd frontend
npm install
npm start
```
Use http://localhost:3000; set `REACT_APP_API_URL=http://localhost/api` so the dev app talks to the API via Nginx.

**Rebuild**
```bash
# One service
docker-compose build backend
docker-compose up -d backend

# All
docker-compose build
docker-compose up -d
```

**Logs**
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## API Examples

**Posts**
```bash
# List
curl http://localhost/api/posts/

# Create
curl -X POST http://localhost/api/posts/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello","author":"Admin"}'

# Get one
curl http://localhost/api/posts/1/

# Update
curl -X PUT http://localhost/api/posts/1/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Delete
curl -X DELETE http://localhost/api/posts/1/
```

**Health**
```bash
curl http://localhost/health
# Backend (inside container):
docker exec blog-backend python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"
```

---

## Project Structure

```
microservices-blog/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── database.py
│       ├── models/
│       ├── schemas/
│       └── routers/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf          # Nginx inside frontend container (SPA + static)
│   ├── package.json
│   ├── .env.production     # REACT_APP_API_URL for production build
│   └── src/
│       ├── components/
│       └── api/
├── nginx/
│   ├── Dockerfile          # Nginx + wget for healthcheck
│   └── nginx.conf          # Reverse proxy config (routes, /health)
├── postgres/
│   └── init.sql
├── docker-compose.yml
├── .env.example
├── .env                    # Not committed; copy from .env.example
└── README.md
```

---

## Security and Hardening

- Non-root users in backend and frontend containers where applicable.
- Health checks on all services; Nginx waits for healthy frontend and backend.
- CORS configured in FastAPI (localhost and Nginx origin).
- Secrets and URLs via environment variables; no credentials in code.
- Multi-stage builds to keep runtime images minimal.
- Network isolation: backend-net for DB/cache, frontend-net for proxy and app.

---

## Performance

- Redis caching (e.g. 30s TTL for post list where implemented).
- Multi-stage Docker builds and Alpine-based images.
- Nginx gzip and long-lived cache headers for static assets in frontend container.
- SQLAlchemy connection pooling for PostgreSQL.

---

## Troubleshooting

**Containers not starting or unhealthy**
```bash
docker-compose ps
docker-compose logs
docker inspect blog-nginx
```
Ensure `.env` exists and matches `.env.example`; rebuild with `docker-compose build --no-cache` if needed.

**Full reset**
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

**Database**
```bash
docker-compose logs postgres
docker exec -it blog-postgres psql -U bloguser -d blogdb
```

---

## Environment Variables

Create `.env` from `.env.example`:

```env
# PostgreSQL
POSTGRES_USER=bloguser
POSTGRES_PASSWORD=blogpassword
POSTGRES_DB=blogdb

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Backend
DATABASE_URL=postgresql://bloguser:blogpassword@postgres:5432/blogdb
```

Change passwords and values for non-local or production use.

---

## Production Checklist

- Use strong, unique values in `.env` (especially `POSTGRES_PASSWORD` and any API keys).
- Ensure backend runs with `DEBUG` disabled and appropriate log level.
- Configure Nginx `server_name` and SSL/TLS (e.g. Let’s Encrypt) in `nginx/nginx.conf`.
- Restrict CORS `allow_origins` in `backend/app/main.py` to your real frontend origin(s).
- Harden firewall (only 80/443 and SSH as needed).
- Set up backups for PostgreSQL and Redis data.
- Consider monitoring (e.g. Prometheus/Grafana) and log aggregation.

---

## References

- [Docker](https://docs.docker.com)
- [Docker Compose](https://docs.docker.com/compose/)
- [FastAPI](https://fastapi.tiangolo.com)
- [React](https://react.dev)
- [Nginx](https://nginx.org/en/docs/)

---

## Author

**Hoang Hai**
- GitHub: [@hoanghai4804](https://github.com/hoanghai4804)

---

## License

This project is for educational use.
