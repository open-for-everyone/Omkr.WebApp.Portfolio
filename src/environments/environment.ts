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
  pageViewApiEndpoints: {
    pageView: '/api/pageview/{pageId}',
    incrementPageView: '/api/pageview/increment/{pageId}',
  },
  spotifyApiEndpoints: {
    authUrl: '/api/spotify/auth/{orgId}/{userName}',
    accessToken: '/api/spotify/access-token/{orgId}/{userName}',
    token: '/api/spotify/token/{orgId}/{userName}',
    currentlyPlaying: '/api/spotify/currently-playing/{orgId}/{userName}',
    search: '/api/spotify/search/{orgId}/{userName}',
    album: '/api/spotify/album/{orgId}/{userName}',
    artist: '/api/spotify/artist/{orgId}/{userName}',
    track: '/api/spotify/track/{orgId}/{userName}',
    playlist: '/api/spotify/playlist/{orgId}/{userName}',
    playlistTracks: '/api/spotify/playlist/tracks/{orgId}/{userName}',
    user: '/api/spotify/user/{orgId}/{userName}',
    userPlaylists: '/api/spotify/user/playlists/{orgId}/{userName}',
  },
  eventApiEndpoints: {
    events: '/api/event',
    getEvent: '/api/event/{orgId}/{eventId}',
    getEvents: '/api/event/{orgId}',
    createEvent: '/api/event/{orgId}',
    updateEvent: '/api/event/{orgId}/{eventId}',
    deleteEvent: '/api/event/{orgId}/{eventId}',

    getEventByDate: '/api/events/{date}',
  },
  fileApiEndpoints: {
    getUrl:'/api/file/geturl/{key}',
    generateUrl:'/api/file/generateUrl/{key}',
  }
};
