// ⚠ NOT USED BY ANY BUILD. angular.json has no `fileReplacements`, so every build — development and
// production alike — reads environment.ts, and nothing imports this file. It is also missing ~16 keys
// the app reads (awsUserApiBaseUrl, mapConfig, sessionConfig, …), so wiring it in as-is would break the
// production build rather than fix anything.
//
// Change environment.ts. Editing this file has no effect: it is exactly how the contact form kept
// posting to the retired dev-api-v2 API after the URL was "fixed" here.
//
// Safe to delete once you're happy nothing external refers to it.
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
