const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';
const localIP = window.location.hostname;

const config = {
  isProduction,
  socketURI: isProduction
    ? 'wss://pokerpocket.nitramite.com/api'
    : isStaging
      ? 'wss://pokerpocket-staging.nitramite.com/api'
      : `ws://${localIP}:8000/api`,
};

export default config;
