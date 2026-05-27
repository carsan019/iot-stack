import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

@Component({
  selector: 'app-grafana-local-page',
  standalone: true,
  imports: [DashboardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-dashboard fuente="local"></app-dashboard>`,
})
export class GrafanaLocalPageComponent {}
