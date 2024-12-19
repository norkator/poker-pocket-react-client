export const NewWsSocket = (url, onConnect, onClose) => {
  const webSocket = new WebSocket(url);

  const id = Math.floor(Math.random() * 1000);
  const data = { webSocket, id };

  const handler = {};

  const registerCallbacks = (webSocket) => {
    // WebSocket events
    webSocket.onopen = (event) => {
      if (onConnect) onConnect(data);
    };
    webSocket.onmessage = (event) => {
      const jsonData = JSON.parse(event.data);
      console.debug(jsonData.key, JSON.stringify(jsonData));
      if (jsonData.key in handler) {
        handler[jsonData.key](jsonData);
        return;
      }

      console.warn('jsonData no handler found', jsonData.key);
    };
    webSocket.onclose = () => {
      if (onClose) onClose(data);
    };
  };

  registerCallbacks(webSocket);

  const regHandler = (key, callback) => {
    handler[key] = callback;
  };

  const send = (data) => {
    webSocket.send(data);
  };

  const close = () => {
    webSocket.close();
  };
  data.send = send;
  data.close = close;
  data.handle = regHandler;

  return data;
};
