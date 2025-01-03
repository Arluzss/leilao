import WebSocket, { WebSocketServer } from 'ws';
import * as fs from 'fs';

const wss = new WebSocketServer({ port: 8080 });
let percent = { '1': 0.10, '2': 0.20, '3': 0.30, '4': 0.40 };

wss.on('connection', (ws: WebSocket, req) => {
    console.log('New client connected');

    ws.on('message', (message: string) => {
        console.log(`Received message => ${message}`);
        let car = changePrice(Number(JSON.parse(message).id), JSON.parse(message).value);
        ws.send(JSON.stringify(car));
    });

    ws.on('close', () => {
        console.log('Client has disconnected');
    });

    if (req.url === undefined) { return; }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const query = new URLSearchParams(url.search);

    ws.send(JSON.stringify(findCarById(Number(query.get('id')))));
});

console.log('WebSocket server is running on ws://localhost:8080');
interface Car {
    id: number;
    nome: string;
    marca: string;
    preco: number;
    imagem: string;
}

interface Categoria {
    popular: Car[];
    luxo: Car[];
}

interface CarData {
    categorias: Categoria[];
}

const rawData = fs.readFileSync('src/Cars.json', 'utf-8');
const carData: CarData = JSON.parse(rawData);

function findCarById(id: number): Car | undefined {
    for (const categoria of carData.categorias) {
        const car = categoria.popular.find(car => car.id === id) || categoria.luxo.find(car => car.id === id);
        if (car) {
            return car;
        }
    }
    return undefined;
}

function changePrice(id: number, value: keyof typeof percent): Car | undefined {
    const car = findCarById(id);
    if (car) {
        car.preco += car.preco * percent[value];
        console.log(`Price of ${car.nome} changed to ${car.preco}`);
        return car;
    }
    return undefined;
}

