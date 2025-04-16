import WebSocket from 'ws';
import { handleMessage } from './handleMessage';
import { env } from '../../config/env';

const wss = new WebSocket.Server({ port: Number(env.ws.port) || 8080 });
let clients: WebSocket[] = [];

wss.on('connection', (ws: WebSocket, req) => {
    console.log('New client connected');
    
    clients.push(ws);

    ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

    ws.on('message', (message: string) => {
        handleMessage(ws, message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients = clients.filter(client => client !== ws);
    });
});

console.log('WebSocket server running on ws://localhost:' + env.ws.port || 8080);