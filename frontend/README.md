# proyectIOT

Frontend Angular 19 (standalone) para monitoreo IoT que **consume Grafana** vía iframes y permite **disparar acciones HTTP** desde botones configurables.

Tiene dos páginas paralelas con la misma UI pero apuntando a instancias distintas de Grafana:

| Ruta | Fuente |
| --- | --- |
| `/local` | Grafana corriendo en tu red local (por defecto `http://localhost:3000`) |
| `/cloud` | Grafana en la nube (por ej. `https://your-stack.grafana.net`) |

Los paneles, los botones y el historial se guardan por separado para cada fuente en `localStorage`.

## Estructura

```
src/
├─ app/
│  ├─ components/
│  │  ├─ navbar/              # Navegación entre /local y /cloud
│  │  ├─ dashboard/           # Vista compartida (paneles + botones + historial)
│  │  ├─ panel-grafana/       # iframe de un panel d-solo
│  │  ├─ boton-accion/        # Botón configurable que dispara un HTTP request
│  │  ├─ form-panel/          # Formulario para agregar paneles
│  │  └─ form-boton/          # Formulario para agregar botones de acción
│  ├─ pages/
│  │  ├─ grafana-local-page.component.ts
│  │  └─ grafana-cloud-page.component.ts
│  ├─ models/                 # Tipos PanelGrafana, BotonAccion, etc.
│  ├─ services/
│  │  ├─ grafana.service.ts   # Construye URLs `d-solo` por fuente
│  │  └─ acciones.service.ts  # Dispara HTTP y mantiene historial
│  ├─ app.routes.ts           # /local, /cloud (lazy)
│  └─ app.config.ts
└─ environments/
   ├─ environment.ts
   └─ environment.development.ts
```

## Configuración

Editá `src/environments/environment.development.ts` (y `environment.ts` para producción) y poné las URLs reales:

```ts
export const environment = {
  production: false,
  grafana: {
    local: {
      label: 'Grafana Local',
      baseUrl: 'http://localhost:3000',
      orgId: 1,
      theme: 'dark',
    },
    cloud: {
      label: 'Grafana Cloud',
      baseUrl: 'https://YOUR-STACK.grafana.net',
      orgId: 1,
      theme: 'dark',
    },
  },
  acciones: { endpointBase: '' },
};
```

## Cómo agregar un panel de Grafana

1. En Grafana, abrí el dashboard que querés mostrar.
2. En el panel, abrí el menú **Share → Embed** y copiá:
   - El **Dashboard UID** (lo ves en la URL: `/d/<uid>/...`).
   - El **Panel ID** (parámetro `viewPanel=` o el atributo del panel).
3. En la app (`/local` o `/cloud`), pulsá **+ Panel Grafana** y completá el formulario.
4. Ranges: `from` / `to` aceptan los mismos valores que Grafana (`now-1h`, `now`, etc.).

> Para que el iframe cargue, Grafana debe permitir embebido:
>
> - **Local**: en `grafana.ini` poné `allow_embedding = true` y, si la cookie es necesaria para auth, configurá `auth.anonymous` o un token con permiso de viewer.
> - **Grafana Cloud**: requiere **Public dashboards** o un **service account / API token** + proxy. Lo más simple para una demo es publicar el dashboard como público.

## Cómo agregar un botón de acción

1. Pulsá **+ Botón de acción**.
2. Completá:
   - **Label** (texto del botón) y opcionalmente **icono** (emoji) y **color**.
   - **Método** HTTP (`GET`, `POST`, `PUT`, `DELETE`).
   - **URL** del endpoint (por ejemplo `http://192.168.1.50/api/relay/on`).
   - **Payload** JSON opcional (sólo para `POST`/`PUT`).
   - **Pedir confirmación** si querés un `confirm()` antes de disparar.
3. Al ejecutarse se registra en el **historial** (`ok`, `error`, `pendiente`).

> Si el dispositivo / API destino no permite CORS desde el navegador, vas a necesitar un proxy intermedio o habilitar CORS en el dispositivo.

## Comandos

```bash
npm install         # instalar dependencias
npm start           # ng serve → http://localhost:4200
npm run build       # build de producción
npm test            # tests con Karma + Jasmine
```

## Roadmap sugerido

- Editar paneles/botones existentes (hoy sólo se agregan / eliminan).
- Importar / exportar la configuración (JSON).
- Autenticación contra el backend de acciones.
- WebSocket / SSE para refresco en vivo del estado de los dispositivos.
