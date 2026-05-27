import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

@Component({
  selector: 'app-grafana-cloud-page',
  standalone: true,
  imports: [DashboardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-dashboard fuente="cloud"></app-dashboard>`,
})
export class GrafanaCloudPageComponent {}
