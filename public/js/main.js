var ip_address;
const reportUrl = 'ws://localhost:3099'; // Url to the WebSocket server "wss://[host]:[port]" 

// The reporter object encapsulating the WebSocket
const reporter = {
  socket: null,

  init: function () {
    this.socket = new WebSocket(reportUrl);
    this.socket.addEventListener('open', (event) => {
    this.socket.send(JSON.stringify({ eventCode: 'IP_ADDRESS', message: ip_address }));

    });
  },

  event: function (eventCode, message) {
    console.log(eventCode);
    const isReady = this.socket && this.socket.readyState === WebSocket.OPEN;
    if (isReady) { // Messages triggered before the WebSocket is ready are ignored
      this.socket.send(JSON.stringify({ eventCode: eventCode, message: message }));
    }
  }
};

// Start reporter immediately
reporter.init();
reporter.event('message', ip_address);
// Collect unhandled JavaScript errors and send them to the server
window.addEventListener('error', function (e) {
  reporter.event('JAVASCRIPT_ERROR', e.message + ', ' + e.filename + ', ' + e.lineno + ':' + e.colno);

  let stacktrace = e.stack;
  if (!stacktrace && e.error) {
    stacktrace = e.error.stack;
  }
  if (stacktrace) {
    reporter.event('JAVASCRIPT_ERROR_STACKTRACE', stacktrace);
  }
});
