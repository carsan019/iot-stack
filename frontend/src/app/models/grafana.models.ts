export type FuenteGrafana = 'local' | 'cloud';

export interface ConfigGrafana {
  label: string;
  baseUrl: string;
  orgId: number;
  theme: 'dark' | 'light';
}

export interface PanelGrafana {
  id: string;
  titulo: string;
  dashboardUid: string;
  panelId: number;
  from?: string;
  to?: string;
  refresh?: string;
  altura?: number;
  vars?: Record<string, string>;
}
