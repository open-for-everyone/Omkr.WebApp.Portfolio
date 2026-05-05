export const environment = {
  production: true,
  apiBaseUrl: 'https://api.example.com',
  contactApiBaseUrl: 'https://api.example.com',
  contactApiEndpoints: {
    submit: '/api/contact'
  },
  endpoints: {
    countries: '/v3.1/all',
    anotherEndpoint: '/another-endpoint',
  },
  blogUrl: 'https://www.blogs.keshavsingh.in',
  adminUrl: 'https://www.admin.keshavsingh.in',
  github: {
    username: 'keshavsingh4522',
    apiBase: 'https://api.github.com'
  },
  aiChat: {
    enabled: true,
    baseUrl: 'https://api.example.com/ai-chat',
    apiKey: ''
  },
  // EPFO API endpoints (placeholder – replace with actual EPFO API endpoints)
  epfoApiEndpoints: {
    login: 'api/epfo/login',
    accountDetails: 'api/epfo/account/{uan}',
    passbook: 'api/epfo/passbook/{uan}',
    balance: 'api/epfo/balance/{uan}',
    nominees: 'api/epfo/nominees/{uan}',
    allData: 'api/epfo/data/{uan}'
  }
};
