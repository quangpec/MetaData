const { v4: uuidv4 } = require('uuid'); // "npm install uuid"
 
// Open log file
const fs = require('fs');
const log_file = fs.createWriteStream(__dirname + '/events.log', {flags : 'a'});
function handleEvent(message, connectionId) {
  log_file.write(`${timestamp()} [${connectionId}]  ${message}\n`);
}
 
// Start server
const yargs = require('yargs');  // To read command line arguments
const argv = yargs.option('port', { type: 'number' }).argv;
const port = argv.port || 3099;  // The listening port can be changed via command line
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: port });
wss.on('connection', function connection(ws,req) {
  // Handle start of connection
  const startedAt = Date.now();
  const connectionId = uuidv4(); // Random UUID
  console.log(req.socket.remoteAddress);
  handleEvent('START_PAGE_VIEW'+req.socket.remoteAddress, connectionId);
 
  // Handle message
  ws.on('message', function incoming(message) {
    const json = JSON.parse(message);
    handleEvent(`${json.eventCode} ${json.message}`, connectionId);
  });
 
  // Handle end of connection
  ws.on('close', function() {
    handleEvent('END_PAGE_VIEW ' + millisecondsToStr(Date.now() - startedAt), connectionId);
  });
  ws.on('error', function() {
    handleEvent('END_PAGE_VIEW [error] ' + millisecondsToStr(Date.now() - startedAt), connectionId);
  });
});
 
console.log(`WebSocket server running at http://localhost:${port}/`);
 
// ----- help functions -------
 
// Current time YYYY-MM-DD HH-MM-SS
function timestamp() {
  const d = new Date();
  return pad(d.getFullYear()) + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + 
         pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}
function pad(n) { return n < 10 ? "0" + n : n}
 
// Human readable duration: "2 minutes", "34 seconds". From https://stackoverflow.com/a/8212878/1128103
function millisecondsToStr(milliseconds) {
  let temp = Math.floor(milliseconds / 1000);
  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return hours + ' hour' + numberEnding(hours);
  }
  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return minutes + ' minute' + numberEnding(minutes);
  }
  const seconds = temp % 60;
  if (seconds) {
    return seconds + ' second' + numberEnding(seconds);
  }
  return 'less than a second';
}
function numberEnding(number) { return (number > 1) ? 's' : ''; }