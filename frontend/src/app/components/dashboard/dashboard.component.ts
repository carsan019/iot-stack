import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BotonAccion, RegistroEjecucion } from '../../models/accion.models';
import { FuenteGrafana, PanelGrafana } from '../../models/grafana.models';
import { AccionesService } from '../../services/acciones.service';
import { ConfigGrafanaService } from '../../services/config-grafana.service';
import { GrafanaService } from '../../services/grafana.service';
import { BotonAccionComponent } from '../boton-accion/boton-accion.component';
import { FormBotonComponent } from '../form-boton/form-boton.component';
import { FormConfigGrafanaComponent } from '../form-config-grafana/form-config-grafana.component';
import { FormPanelComponent } from '../form-panel/form-panel.component';
import { PanelGrafanaComponent } from '../panel-grafana/panel-grafana.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PanelGrafanaComponent,
    BotonAccionComponent,
    FormPanelComponent,
    FormBotonComponent,
    FormConfigGrafanaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly grafanaService = inject(GrafanaService);
  private readonly accionesService = inject(AccionesService);
  private readonly configService = inject(ConfigGrafanaService);

  @Input({ required: true }) fuente!: FuenteGrafana;

  readonly mostrarFormPanel = signal(false);
  readonly mostrarFormBoton = signal(false);
  readonly mostrarFormConfig = signal(false);

  readonly config = computed(() =>
    this.fuente === 'local' ? this.configService.local() : this.configService.cloud(),
  );
  readonly conexionLista = computed(() => {
    const url = this.config()?.baseUrl ?? '';
    return /^https?:\/\/.+/i.test(url) && !url.includes('YOUR-STACK');
  });
  readonly paneles = computed<PanelGrafana[]>(() =>
    this.fuente === 'local'
      ? this.grafanaService.panelesLocal()
      : this.grafanaService.panelesCloud(),
  );
  readonly botones = computed<BotonAccion[]>(() =>
    this.fuente === 'local'
      ? this.accionesService.botonesLocal()
      : this.accionesService.botonesCloud(),
  );
  readonly historial = computed<RegistroEjecucion[]>(() =>
    this.accionesService.historial(),
  );

  agregarPanel(panel: Omit<PanelGrafana, 'id'>): void {
    this.grafanaService.agregarPanel(this.fuente, panel);
    this.mostrarFormPanel.set(false);
  }

  eliminarPanel(id: string): void {
    this.grafanaService.eliminarPanel(this.fuente, id);
  }

  agregarBoton(boton: Omit<BotonAccion, 'id'>): void {
    this.accionesService.agregarBoton(this.fuente, boton);
    this.mostrarFormBoton.set(false);
  }

  eliminarBoton(id: string): void {
    this.accionesService.eliminarBoton(this.fuente, id);
  }

  ejecutarBoton(boton: BotonAccion): void {
    void this.accionesService.ejecutar(boton);
  }

  onConfigGuardada(): void {
    this.mostrarFormConfig.set(false);
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }
}
