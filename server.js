const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const peers = {};

server.on('message', (msg, rinfo) => {
    const data = JSON.parse(msg.toString());
    const { roomId } = data;

    if (!peers[roomId]) peers[roomId] = [];

    if (!peers[roomId].some(p => p.address === rinfo.address && p.port === rinfo.port)) {
        peers[roomId].push({ address: rinfo.address, port: rinfo.port });
    }

    console.log(`Peer joined ${roomId}: `,rinfo.address, rinfo.port);

    if (peers[roomId].length === 2) {
        const [a, b] = peers[roomId];

        server.send(JSON.stringify(b), a.port, a.address);
        server.send(JSON.stringify(a), b.port, b.address);

        console.log(`Exchange peers for room ${roomId}`);
    }
});


server.bind(4000, () => {
    console.log('Rendezvous server listerning on port 4000');
})