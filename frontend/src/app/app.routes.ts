import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'local' },
  {
    path: 'local',
    loadComponent: () =>
      import('./pages/grafana-local-page.component').then(
        (m) => m.GrafanaLocalPageComponent,
      ),
    title: 'proyectIOT · Grafana Local',
  },
  {
    path: 'cloud',
    loadComponent: () =>
      import('./pages/grafana-cloud-page.component').then(
        (m) => m.GrafanaCloudPageComponent,
      ),
    title: 'proyectIOT · Grafana Cloud',
  },
  { path: '**', redirectTo: 'local' },
];
