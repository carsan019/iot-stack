export const environment = {
  production: true,
  grafana: {
    local: {
      label: 'Grafana Local',
      baseUrl: 'http://44.203.19.150:8080',
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
    endpointBase: 'http://44.203.19.150:8000',
  },
};
