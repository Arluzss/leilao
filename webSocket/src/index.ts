import WebSocket, { WebSocketServer } from 'ws';
import * as fs from 'fs';

const wss = new WebSocketServer({ port: 8080 });
let percent: { [key: number]: number } = { 1: 0.10, 2: 0.20, 3: 0.30, 4: 0.40 };

interface Session {
    userID: string | null;
    category: string | null;
    auctionID: string | null;
    client: WebSocket;
}

let session: Session[] = [];

wss.on('connection', (ws: WebSocket, req) => {

    ws.on('message', (message: string) => {
        let car = changeCarPrice(Number(JSON.parse(message).auctionID), JSON.parse(message).value);
        ws.send(JSON.stringify(car));
        console.log(message);
    });

    if (req.url === undefined) { return; }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const query = new URLSearchParams(url.search);

    if (!session.some(s => s.auctionID === query.get('auctionID') && s.userID === query.get('userID') && s.category === query.get('category'))) {
        session.push({ auctionID: query.get('auctionID'), userID: query.get('userID'), category: query.get('category') ,client: ws });
    }
    session.forEach(s => {
        console.log(`Auction ID: ${s.auctionID}, category: ${s.category} User ID: ${s.userID}`);
    });

    ws.send(JSON.stringify(findCarById(Number(query.get('auctionID')))));
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
const carData: CarData[] = JSON.parse(rawData); // Corrigindo a tipagem

// Função para listar categorias corretamente
function findCarById(id: number): Car | undefined {
    for (const categoria of carData[0].categorias) {
        for (const car of categoria.popular) {
            if (car.id === id) {
                return car;
            }
        }
        for (const car of categoria.luxo) {
            if (car.id === id) {
                return car;
            }
        }
    }
    return undefined;
}

function changeCarPrice(id: number, value: keyof typeof percent): Car | undefined {
    const car = findCarById(id);
    if (car) {
        car.preco += car.preco * percent[value];
        console.log(`Price of ${car.nome} changed to ${car.preco}`);
        return car;
    }
    return undefined;
}

