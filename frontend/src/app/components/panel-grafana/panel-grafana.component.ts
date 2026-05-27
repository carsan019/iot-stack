import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FuenteGrafana, PanelGrafana } from '../../models/grafana.models';
import { GrafanaService } from '../../services/grafana.service';

@Component({
  selector: 'app-panel-grafana',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './panel-grafana.component.html',
  styleUrl: './panel-grafana.component.scss',
})
export class PanelGrafanaComponent {
  private readonly grafanaService = inject(GrafanaService);

  @Input({ required: true }) panel!: PanelGrafana;
  @Input({ required: true }) fuente!: FuenteGrafana;
  @Output() eliminar = new EventEmitter<string>();

  get url() {
    return this.grafanaService.construirUrlIframe(this.fuente, this.panel);
  }

  get altura(): number {
    return this.panel.altura ?? 320;
  }

  onEliminar(): void {
    this.eliminar.emit(this.panel.id);
  }
}
