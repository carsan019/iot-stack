export const environment = {
  production: false,
  grafana: {
    local: {
      label: 'Grafana Local',
      baseUrl: 'http://localhost:8080',
      orgId: 1,
      theme: 'dark' as 'dark' | 'light',
    },
    cloud: {
      label: 'Grafana Cloud',
      baseUrl: 'http://44.203.19.150:8080',
      orgId: 1,
      theme: 'dark' as 'dark' | 'light',
    },
  },
  acciones: {
    endpointBase: '',
  },
};
