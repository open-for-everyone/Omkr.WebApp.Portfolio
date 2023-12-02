export const environment = {
  production: false,
  awsUserApiBaseUrl: 'https://tzbmrk30i1.execute-api.eu-west-1.amazonaws.com/Prod',
  countryApiBaseUrl: 'https://api.example.com',

  awsUserApiEndpoints: {
    user: '/api/user',
    getUser: '/api/user/{orgId}/{username}',
    organizations: "/api/organization",
    getOrganization:"/api/organization/{orgId}",
  },
  countryApiEndpoints: {
    countries: '/v3.1/all',
  }
};
