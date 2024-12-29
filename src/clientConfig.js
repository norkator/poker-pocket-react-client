const config = {
  isProduction: process.env.NODE_ENV === 'production',
  socketURI:
    process.env.NODE_ENV === 'production'
      ? 'wss://pokerpocket.nitramite.com/api'
      : process.env.NODE_ENV === 'staging'
        ? 'wss://pokerpocket-staging.nitramite.com/api'
        : 'ws://localhost:8000',
};

export default config;
