# IoT Stack

Stack completo para proyectos IoT con MQTT, API REST y visualización en Grafana.

## Servicios

| Servicio | Puerto | Descripción |
|---|---|---|
| **API FastAPI** | `8000` | REST API para recibir mediciones y controlar dispositivos |
| **Mosquitto** | `1883` | Broker MQTT |
| **PostgreSQL** | `5432` | Base de datos de mediciones |
| **Grafana** | `8080` | Dashboards de visualización |

## Requisitos

- [Docker](https://www.docker.com/products/docker-desktop) instalado

## Levantar el stack

```bash
docker compose up -d
```

## Endpoints API

### Guardar medición
```
POST http://localhost:8000/mediciones
Content-Type: application/json

{ "nodo": "nodo1", "variable": "temperatura", "valor": 25.4 }
```

### Controlar LED
```
POST http://localhost:8000/led/ON
POST http://localhost:8000/led/OFF
POST http://localhost:8000/led/TOGGLE
```

### Documentación interactiva
```
http://localhost:8000/docs
```

## Grafana

- URL: `http://localhost:8080`
- Usuario: `admin` / Contraseña: `admin`
- Data Source: PostgreSQL → `postgres:5432` / db: `abcd` / user: `abcd` / pass: `abcd`

## Variables de entorno (opcional)

Crea un archivo `.env` para personalizar credenciales:

```env
POSTGRES_USER=abcd
POSTGRES_PASSWORD=abcd
POSTGRES_DB=abcd
```
