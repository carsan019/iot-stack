import { Injectable, computed, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ConfigGrafana, FuenteGrafana } from '../models/grafana.models';

const STORAGE_KEY = 'proyectIOT.configGrafana';

@Injectable({ providedIn: 'root' })
export class ConfigGrafanaService {
  private readonly _config = signal<Record<FuenteGrafana, ConfigGrafana>>(
    this.cargar(),
  );

  readonly local = computed(() => this._config().local);
  readonly cloud = computed(() => this._config().cloud);

  obtener(fuente: FuenteGrafana): ConfigGrafana {
    return this._config()[fuente];
  }

  actualizar(fuente: FuenteGrafana, cfg: ConfigGrafana): void {
    const actual = this._config();
    this._config.set({ ...actual, [fuente]: cfg });
    this.persistir();
  }

  restablecer(fuente: FuenteGrafana): void {
    const actual = this._config();
    this._config.set({ ...actual, [fuente]: this.defecto(fuente) });
    this.persistir();
  }

  private defecto(fuente: FuenteGrafana): ConfigGrafana {
    return { ...environment.grafana[fuente] };
  }

  private cargar(): Record<FuenteGrafana, ConfigGrafana> {
    const def: Record<FuenteGrafana, ConfigGrafana> = {
      local: this.defecto('local'),
      cloud: this.defecto('cloud'),
    };
    if (typeof localStorage === 'undefined') return def;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return def;
      const parsed = JSON.parse(raw) as Partial<
        Record<FuenteGrafana, ConfigGrafana>
      >;
      return {
        local: { ...def.local, ...(parsed.local ?? {}) },
        cloud: { ...def.cloud, ...(parsed.cloud ?? {}) },
      };
    } catch {
      return def;
    }
  }

  private persistir(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._config()));
  }
}
