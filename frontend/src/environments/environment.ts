export const environment = {
  production: true,
  grafana: {
    local: {
      label: 'Grafana Local',
      baseUrl: 'http://localhost:3000',
      orgId: 1,
      theme: 'dark' as 'dark' | 'light',
    },
    cloud: {
      label: 'Grafana Cloud',
      baseUrl: 'https://YOUR-STACK.grafana.net',
      orgId: 1,
      theme: 'dark' as 'dark' | 'light',
    },
  },
  acciones: {
    endpointBase: '',
  },
};
