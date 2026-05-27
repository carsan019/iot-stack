import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { BotonAccion } from '../../models/accion.models';

@Component({
  selector: 'app-boton-accion',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './boton-accion.component.html',
  styleUrl: './boton-accion.component.scss',
})
export class BotonAccionComponent {
  @Input({ required: true }) boton!: BotonAccion;
  @Output() ejecutar = new EventEmitter<BotonAccion>();
  @Output() eliminar = new EventEmitter<string>();

  readonly ejecutando = signal(false);

  async onEjecutar(): Promise<void> {
    if (this.ejecutando()) return;
    if (this.boton.confirmar) {
      const ok = confirm(`¿Ejecutar acción "${this.boton.label}"?`);
      if (!ok) return;
    }
    this.ejecutando.set(true);
    try {
      this.ejecutar.emit(this.boton);
    } finally {
      setTimeout(() => this.ejecutando.set(false), 600);
    }
  }

  onEliminar(event: Event): void {
    event.stopPropagation();
    this.eliminar.emit(this.boton.id);
  }
}
