export interface PanelParseado {
  baseUrl?: string;
  dashboardUid?: string;
  panelId?: number;
  titulo?: string;
  from?: string;
  to?: string;
  refresh?: string;
  orgId?: number;
  vars?: Record<string, string>;
}

/**
 * Parsea cualquiera de estas formas:
 *   - URL de un dashboard:   https://host/d/<uid>/<slug>?orgId=1&from=...&to=...&viewPanel=2
 *   - URL de panel solo:     https://host/d-solo/<uid>/<slug>?orgId=1&panelId=2&from=...
 *   - Snippet HTML <iframe src="..."></iframe>
 *   - Una URL pegada con espacios al borde
 *
 * Extrae lo que pueda, sin lanzar errores.
 */
export function parseUrlGrafana(input: string): PanelParseado {
  const limpio = (input ?? '').trim();
  if (!limpio) return {};

  const url = extraerUrl(limpio);
  if (!url) return {};

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return {};
  }

  const resultado: PanelParseado = {
    baseUrl: `${parsed.protocol}//${parsed.host}`,
  };

  const partes = parsed.pathname.split('/').filter(Boolean);
  const idxDashboard = partes.findIndex((p) => p === 'd' || p === 'd-solo');
  if (idxDashboard !== -1 && partes[idxDashboard + 1]) {
    resultado.dashboardUid = partes[idxDashboard + 1];
    if (partes[idxDashboard + 2]) {
      resultado.titulo = decodeURIComponent(partes[idxDashboard + 2])
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  const params = parsed.searchParams;
  const panelIdStr = params.get('panelId') ?? params.get('viewPanel');
  if (panelIdStr) {
    const n = Number(panelIdStr);
    if (Number.isFinite(n)) resultado.panelId = n;
  }

  const orgIdStr = params.get('orgId');
  if (orgIdStr) {
    const n = Number(orgIdStr);
    if (Number.isFinite(n)) resultado.orgId = n;
  }

  const from = params.get('from');
  if (from) resultado.from = from;
  const to = params.get('to');
  if (to) resultado.to = to;
  const refresh = params.get('refresh');
  if (refresh) resultado.refresh = refresh;

  const vars: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key.startsWith('var-')) {
      vars[key.slice(4)] = value;
    }
  });
  if (Object.keys(vars).length) resultado.vars = vars;

  return resultado;
}

function extraerUrl(input: string): string | undefined {
  const matchIframe = input.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  if (matchIframe) return matchIframe[1];

  const matchUrl = input.match(/https?:\/\/[^\s"'<>]+/i);
  if (matchUrl) return matchUrl[0];

  return undefined;
}
