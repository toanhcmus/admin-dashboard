let socket = null;

export const initWebSocket = (token) => {
  if (socket) {
    socket.close();
  }

  console.log(process.env.REACT_APP_URL_SERVICE);

  socket = new WebSocket(`${process.env.REACT_APP_URL_SERVICE}?token=${token}`);
  console.log(socket);

  socket.onopen = () => {
    console.log("WebSocket connection opened");
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log(message);
    // Xử lý thông báo từ server
    // toast.info(`New notification: ${message.title}`);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
