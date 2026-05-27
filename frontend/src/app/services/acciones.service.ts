import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BotonAccion, RegistroEjecucion } from '../models/accion.models';
import { FuenteGrafana as Fuente } from '../models/grafana.models';

const STORAGE_KEY_BOTONES = 'proyectIOT.botones';
const STORAGE_KEY_HISTORIAL = 'proyectIOT.historial';
const MAX_HISTORIAL = 50;

@Injectable({ providedIn: 'root' })
export class AccionesService {
  private readonly http = inject(HttpClient);

  private readonly _botones = signal<Record<Fuente, BotonAccion[]>>(
    this.cargarBotones(),
  );
  private readonly _historial = signal<RegistroEjecucion[]>(
    this.cargarHistorial(),
  );

  readonly botonesLocal = computed(() => this._botones().local);
  readonly botonesCloud = computed(() => this._botones().cloud);
  readonly historial = computed(() => this._historial());

  obtenerBotones(fuente: Fuente): BotonAccion[] {
    return this._botones()[fuente];
  }

  agregarBoton(fuente: Fuente, boton: Omit<BotonAccion, 'id'>): void {
    const nuevo: BotonAccion = { ...boton, id: crypto.randomUUID() };
    const actual = this._botones();
    this._botones.set({
      ...actual,
      [fuente]: [...actual[fuente], nuevo],
    });
    this.persistirBotones();
  }

  eliminarBoton(fuente: Fuente, id: string): void {
    const actual = this._botones();
    this._botones.set({
      ...actual,
      [fuente]: actual[fuente].filter((b) => b.id !== id),
    });
    this.persistirBotones();
  }

  async ejecutar(boton: BotonAccion): Promise<RegistroEjecucion> {
    const base: RegistroEjecucion = {
      id: crypto.randomUUID(),
      botonId: boton.id,
      botonLabel: boton.label,
      fecha: new Date().toISOString(),
      estado: 'pendiente',
    };
    this.agregarHistorial(base);

    try {
      let payload: unknown = undefined;
      if (boton.payload && boton.metodo !== 'GET') {
        try {
          payload = JSON.parse(boton.payload);
        } catch {
          payload = boton.payload;
        }
      }

      const resp =
        boton.metodo === 'GET' || boton.metodo === 'DELETE'
          ? await firstValueFrom(
              this.http.request(boton.metodo, boton.url, {
                responseType: 'text',
              }),
            )
          : await firstValueFrom(
              this.http.request(boton.metodo, boton.url, {
                body: payload,
                responseType: 'text',
              }),
            );

      const final: RegistroEjecucion = {
        ...base,
        estado: 'ok',
        mensaje: typeof resp === 'string' ? resp.slice(0, 200) : 'OK',
      };
      this.actualizarHistorial(final);
      return final;
    } catch (err: unknown) {
      let mensaje = 'Error desconocido al ejecutar';
      if (err instanceof HttpErrorResponse) {
        mensaje = `HTTP ${err.status}: ${err.statusText || err.message}`;
        if (err.status === 0) {
          mensaje = `No se pudo conectar con ${boton.url} — verifica que el servidor esté activo y que CORS esté habilitado.`;
        }
      } else if (err instanceof Error) {
        mensaje = err.message;
      }
      const final: RegistroEjecucion = {
        ...base,
        estado: 'error',
        mensaje,
      };
      this.actualizarHistorial(final);
      return final;
    }
  }

  private agregarHistorial(reg: RegistroEjecucion): void {
    const actual = [reg, ...this._historial()].slice(0, MAX_HISTORIAL);
    this._historial.set(actual);
    this.persistirHistorial();
  }

  private actualizarHistorial(reg: RegistroEjecucion): void {
    const actual = this._historial().map((r) => (r.id === reg.id ? reg : r));
    this._historial.set(actual);
    this.persistirHistorial();
  }

  private cargarBotones(): Record<Fuente, BotonAccion[]> {
    if (typeof localStorage === 'undefined') return { local: [], cloud: [] };
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BOTONES);
      if (!raw) return { local: [], cloud: [] };
      const parsed = JSON.parse(raw) as Record<Fuente, BotonAccion[]>;
      return {
        local: parsed.local ?? [],
        cloud: parsed.cloud ?? [],
      };
    } catch {
      return { local: [], cloud: [] };
    }
  }

  private cargarHistorial(): RegistroEjecucion[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORIAL);
      return raw ? (JSON.parse(raw) as RegistroEjecucion[]) : [];
    } catch {
      return [];
    }
  }

  private persistirBotones(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_BOTONES, JSON.stringify(this._botones()));
  }

  private persistirHistorial(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(
      STORAGE_KEY_HISTORIAL,
      JSON.stringify(this._historial()),
    );
  }
}
