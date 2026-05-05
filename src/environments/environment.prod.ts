export const environment = {
  production: true,
  /** Public GitHub avatar for Keshav Singh (used in banner and about sections) */
  githubAvatarUrl: 'https://avatars.githubusercontent.com/u/43788985?s=400&u=cf0b65c4fa048d4dbc69e1e575993afaa427cda1&v=4',
  apiBaseUrl: 'https://api.example.com',
  contactApiBaseUrl: 'https://api.example.com',
  contactApiEndpoints: {
    submit: '/api/contact'
  },
  endpoints: {
    countries: '/v3.1/all',
    anotherEndpoint: '/another-endpoint',
  },
  blogUrl: 'https://blog.keshavsingh.in',
  adminUrl: 'https://admin.keshavsingh.in',
  github: {
    username: 'keshavsingh3197',
    apiBase: 'https://api.github.com'
  },
  aiChat: {
    enabled: true,
    baseUrl: 'https://api.example.com/ai-chat',
    apiKey: ''
  }
};
