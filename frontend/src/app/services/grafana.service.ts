import { Injectable, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  ConfigGrafana,
  FuenteGrafana,
  PanelGrafana,
} from '../models/grafana.models';
import { ConfigGrafanaService } from './config-grafana.service';

const STORAGE_KEY = 'proyectIOT.paneles';

@Injectable({ providedIn: 'root' })
export class GrafanaService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly configService = inject(ConfigGrafanaService);

  private readonly _paneles = signal<Record<FuenteGrafana, PanelGrafana[]>>(
    this.cargarDesdeStorage(),
  );

  readonly panelesLocal = computed(() => this._paneles().local);
  readonly panelesCloud = computed(() => this._paneles().cloud);

  obtenerConfig(fuente: FuenteGrafana): ConfigGrafana {
    return this.configService.obtener(fuente);
  }

  obtenerPaneles(fuente: FuenteGrafana): PanelGrafana[] {
    return this._paneles()[fuente];
  }

  agregarPanel(fuente: FuenteGrafana, panel: Omit<PanelGrafana, 'id'>): void {
    const nuevo: PanelGrafana = { ...panel, id: crypto.randomUUID() };
    const actual = this._paneles();
    this._paneles.set({
      ...actual,
      [fuente]: [...actual[fuente], nuevo],
    });
    this.persistir();
  }

  eliminarPanel(fuente: FuenteGrafana, id: string): void {
    const actual = this._paneles();
    this._paneles.set({
      ...actual,
      [fuente]: actual[fuente].filter((p) => p.id !== id),
    });
    this.persistir();
  }

  construirUrlIframe(
    fuente: FuenteGrafana,
    panel: PanelGrafana,
  ): SafeResourceUrl {
    const cfg = this.obtenerConfig(fuente);
    const params = new URLSearchParams();
    params.set('orgId', String(cfg.orgId));
    params.set('panelId', String(panel.panelId));
    params.set('theme', cfg.theme);
    if (panel.from) params.set('from', panel.from);
    if (panel.to) params.set('to', panel.to);
    if (panel.refresh) params.set('refresh', panel.refresh);
    if (panel.vars) {
      for (const [k, v] of Object.entries(panel.vars)) {
        params.append(`var-${k}`, v);
      }
    }
    const base = (cfg.baseUrl || '').replace(/\/$/, '');
    const url = `${base}/d-solo/${panel.dashboardUid}?${params.toString()}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private cargarDesdeStorage(): Record<FuenteGrafana, PanelGrafana[]> {
    if (typeof localStorage === 'undefined') {
      return { local: [], cloud: [] };
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { local: [], cloud: [] };
      const parsed = JSON.parse(raw) as Record<FuenteGrafana, PanelGrafana[]>;
      return {
        local: parsed.local ?? [],
        cloud: parsed.cloud ?? [],
      };
    } catch {
      return { local: [], cloud: [] };
    }
  }

  private persistir(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._paneles()));
  }
}
