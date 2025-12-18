const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const SERVER_IP = 'YOUR_SERVER_PUBLIC_IP';
const SERVER_PORT = 4000;
const ROOM_ID = 'demo-room';

let peerAddr = null;
let connected = false;

// Bind to a random local port
socket.bind(() => {
  console.log('Local UDP port:', socket.address().port);

  // Register with server
  socket.send(
    JSON.stringify({ roomId: ROOM_ID }),
    SERVER_PORT,
    SERVER_IP
  );
});

socket.on('message', (msg, rinfo) => {
  // If message comes from server, it's peer info
  if (rinfo.address === SERVER_IP) {
    peerAddr = JSON.parse(msg.toString());
    console.log('Received peer:', peerAddr);
    startPunching();
    return;
  }

  // Message from peer
  if (!connected) {
    connected = true;
    console.log('🎉 P2P connection established with', rinfo.address, rinfo.port);
  }

  console.log('Peer says:', msg.toString());
});

function startPunching() {
  const interval = setInterval(() => {
    socket.send(
      Buffer.from('punch'),
      peerAddr.port,
      peerAddr.address
    );
  }, 100);

  // Stop aggressive punching after connection
  setTimeout(() => clearInterval(interval), 5000);
}

// Send keepalive
setInterval(() => {
  if (connected && peerAddr) {
    socket.send(
      Buffer.from('ping'),
      peerAddr.port,
      peerAddr.address
    );
  }
}, 20000);

// Send chat messages
process.stdin.on('data', (data) => {
  if (connected && peerAddr) {
    socket.send(
      data,
      peerAddr.port,
      peerAddr.address
    );
  }
});
