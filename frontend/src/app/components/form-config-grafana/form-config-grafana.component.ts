import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfigGrafana, FuenteGrafana } from '../../models/grafana.models';
import { ConfigGrafanaService } from '../../services/config-grafana.service';

@Component({
  selector: 'app-form-config-grafana',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-config-grafana.component.html',
})
export class FormConfigGrafanaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly configService = inject(ConfigGrafanaService);

  @Input({ required: true }) fuente!: FuenteGrafana;
  @Output() guardado = new EventEmitter<ConfigGrafana>();
  @Output() cancelar = new EventEmitter<void>();

  readonly form = this.fb.nonNullable.group({
    label: ['', Validators.required],
    baseUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]],
    orgId: [1, [Validators.required, Validators.min(1)]],
    theme: ['dark' as 'dark' | 'light', Validators.required],
  });

  ngOnInit(): void {
    const cfg = this.configService.obtener(this.fuente);
    this.form.patchValue(cfg);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const cfg = this.form.getRawValue() as ConfigGrafana;
    this.configService.actualizar(this.fuente, cfg);
    this.guardado.emit(cfg);
  }

  onRestablecer(): void {
    this.configService.restablecer(this.fuente);
    const cfg = this.configService.obtener(this.fuente);
    this.form.patchValue(cfg);
  }
}
