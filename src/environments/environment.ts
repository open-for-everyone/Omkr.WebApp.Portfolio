export const environment = {
  production: false,
  awsUserApiBaseUrl: 'https://tzbmrk30i1.execute-api.eu-west-1.amazonaws.com/Prod',
  countryApiBaseUrl: 'https://api.example.com',

  awsUserApiEndpoints: {
    user: '/api/user',
    getUser: '/api/user/{orgId}/{username}',
    getOrgUsers: '/api/user/{orgId}',
    getAllUsers: '/api/user',
    organizations: "/api/organization",
    getOrganization: "/api/organization/{orgId}",
  },
  countryApiEndpoints: {
    countries: '/v3.1/all',
  },
  awsUserApiHeaders: {
    'x-api-key': '5JX2x5U3UO7s8Kq7kXJ9M6u8B3h5E9K7cW2v4k2U',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With, remember-me'
  },
  visitorApiEndpoints: {
    visitors: '/api/visitor',
    getVisitor: '/api/visitor/{orgId}/{visitorId}',
    getVisitors: '/api/visitor/{orgId}',
    createVisitor: '/api/visitor/{orgId}',
    updateVisitor: '/api/visitor/{orgId}/{visitorId}',
    deleteVisitor: '/api/visitor/{orgId}/{visitorId}',
  },
  messageApiEndpoints: {
    messages: '/api/message',
    getMessage: '/api/message/{orgId}/{userName}/{messageId}',
    getMessages: '/api/message/{orgId}/{fromUserId}/{toUserId}',
    createMessage: '/api/message',
    updateMessage: '/api/message/{orgId}/{userName}/{messageId}',
    deleteMessage: '/api/message/{orgId}/{userName}/{messageId}',
  },
};
