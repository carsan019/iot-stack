import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FuenteGrafana, PanelGrafana } from '../../models/grafana.models';
import { ConfigGrafanaService } from '../../services/config-grafana.service';
import { parseUrlGrafana } from '../../utils/grafana-url.parser';

@Component({
  selector: 'app-form-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-panel.component.html',
  styleUrl: './form-panel.component.scss',
})
export class FormPanelComponent {
  private readonly fb = inject(FormBuilder);
  private readonly configService = inject(ConfigGrafanaService);

  @Input({ required: true }) fuente!: FuenteGrafana;
  @Output() guardar = new EventEmitter<Omit<PanelGrafana, 'id'>>();
  @Output() cancelar = new EventEmitter<void>();

  readonly mostrarAvanzado = signal(false);
  readonly mensaje = signal<string | null>(null);
  readonly baseUrlPegada = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    urlPegada: [''],
    titulo: ['', Validators.required],
    dashboardUid: ['', Validators.required],
    panelId: [1, [Validators.required, Validators.min(1)]],
    from: ['now-1h'],
    to: ['now'],
    refresh: ['10s'],
    altura: [320, [Validators.min(120)]],
  });

  onPaste(event: ClipboardEvent): void {
    const texto = event.clipboardData?.getData('text');
    if (!texto) return;
    setTimeout(() => this.detectar(texto), 0);
  }

  detectar(textoOpt?: string): void {
    const raw = textoOpt ?? this.form.controls.urlPegada.value ?? '';
    if (!raw.trim()) {
      this.mensaje.set('Peg la URL del panel o el snippet del iframe.');
      return;
    }

    const datos = parseUrlGrafana(raw);
    if (!datos.dashboardUid || !datos.panelId) {
      this.mensaje.set(
        'No se pudo detectar el dashboard/panel. Asegurate de pegar una URL de Grafana (.../d/<uid>/... o .../d-solo/<uid>/...?panelId=N).',
      );
      return;
    }

    this.form.patchValue({
      titulo: this.form.controls.titulo.value || datos.titulo || 'Panel',
      dashboardUid: datos.dashboardUid,
      panelId: datos.panelId,
      from: datos.from ?? this.form.controls.from.value,
      to: datos.to ?? this.form.controls.to.value,
      refresh: datos.refresh ?? this.form.controls.refresh.value,
    });

    this.baseUrlPegada.set(datos.baseUrl ?? null);
    const cfgActual = this.configService.obtener(this.fuente).baseUrl;
    if (datos.baseUrl && datos.baseUrl !== cfgActual.replace(/\/$/, '')) {
      this.mensaje.set(
        `Detectado  La URL pegada apunta a ${datos.baseUrl}, pero la conexin configurada es ${cfgActual}. Pods actualizar la conexin.`,
      );
    } else {
      this.mensaje.set('Detectado correctamente. Revis los campos y guard.');
    }
  }

  usarBaseUrlPegada(): void {
    const url = this.baseUrlPegada();
    if (!url) return;
    const cfg = this.configService.obtener(this.fuente);
    this.configService.actualizar(this.fuente, { ...cfg, baseUrl: url });
    this.mensaje.set(`Conexin actualizada a ${url}.`);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.guardar.emit({
      titulo: v.titulo,
      dashboardUid: v.dashboardUid,
      panelId: v.panelId,
      from: v.from,
      to: v.to,
      refresh: v.refresh,
      altura: v.altura,
    });
    this.form.reset({
      urlPegada: '',
      titulo: '',
      dashboardUid: '',
      panelId: 1,
      from: 'now-1h',
      to: 'now',
      refresh: '10s',
      altura: 320,
    });
    this.mensaje.set(null);
    this.baseUrlPegada.set(null);
  }
}
