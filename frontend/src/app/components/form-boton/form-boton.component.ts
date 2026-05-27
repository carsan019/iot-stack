import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BotonAccion } from '../../models/accion.models';

@Component({
  selector: 'app-form-boton',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-boton.component.html',
  styleUrl: './form-boton.component.scss',
})
export class FormBotonComponent {
  private readonly fb = inject(FormBuilder);

  @Output() guardar = new EventEmitter<Omit<BotonAccion, 'id'>>();
  @Output() cancelar = new EventEmitter<void>();

  readonly form = this.fb.nonNullable.group({
    label: ['', Validators.required],
    descripcion: [''],
    color: ['#6366f1', Validators.required],
    icono: [''],
    metodo: ['POST' as 'GET' | 'POST' | 'PUT' | 'DELETE', Validators.required],
    url: ['', Validators.required],
    payload: [''],
    confirmar: [false],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardar.emit(this.form.getRawValue());
    this.form.reset({
      label: '',
      descripcion: '',
      color: '#6366f1',
      icono: '',
      metodo: 'POST',
      url: '',
      payload: '',
      confirmar: false,
    });
  }
}
