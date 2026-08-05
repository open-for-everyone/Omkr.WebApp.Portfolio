export const environment = {
  production: true,
  /** Public GitHub avatar for Keshav Singh (used in banner and about sections) */
  githubAvatarUrl: 'https://avatars.githubusercontent.com/u/43788985?s=400&u=cf0b65c4fa048d4dbc69e1e575993afaa427cda1&v=4',
  apiBaseUrl: 'https://api.example.com',
  // Contact form posts to the admin API, which stores it in the Contact inbox (admin → Manage →
  // Contact inbox). Public + rate limited there; no auth needed from here.
  contactApiBaseUrl: 'https://id.keshavsingh.in',
  contactApiEndpoints: {
    submit: '/api/contact'
  },
  endpoints: {
    countries: '/v3.1/all',
    anotherEndpoint: '/another-endpoint',
  },
  blogUrl: 'https://blog.keshavsingh.in',
  adminUrl: 'https://admin.keshavsingh.in',
  idpApiBaseUrl: 'https://id.keshavsingh.in/api',
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
