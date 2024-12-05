const config = {
  isProduction: process.env.NODE_ENV === 'production',
  socketURI:
    process.env.NODE_ENV === 'production'
      ? 'wss://pokerpocket-wss.nitramite.com'
      : 'ws://localhost:8000',
};

export default config;
