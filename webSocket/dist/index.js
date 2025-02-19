"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const fs = __importStar(require("fs"));
const wss = new ws_1.WebSocketServer({ port: 8080 });
let percent = { 1: 0.10, 2: 0.20, 3: 0.30, 4: 0.40 };
let session = [];
wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
        let car = changeCarPrice(Number(JSON.parse(message).auctionID), JSON.parse(message).value);
        ws.send(JSON.stringify(car));
        console.log(message);
    });
    if (req.url === undefined) {
        return;
    }
    const url = new URL(req.url, `http://${req.headers.host}`);
    const query = new URLSearchParams(url.search);
    if (!session.some(s => s.auctionID === query.get('auctionID') && s.userID === query.get('userID') && s.category === query.get('category'))) {
        session.push({ auctionID: query.get('auctionID'), userID: query.get('userID'), category: query.get('category'), client: ws });
    }
    session.forEach(s => {
        console.log(`Auction ID: ${s.auctionID}, category: ${s.category} User ID: ${s.userID}`);
    });
    ws.send(JSON.stringify(findCarById(Number(query.get('auctionID')))));
});
console.log('WebSocket server is running on ws://localhost:8080');
const rawData = fs.readFileSync('src/Cars.json', 'utf-8');
const carData = JSON.parse(rawData); // Corrigindo a tipagem
// Função para listar categorias corretamente
function findCarById(id) {
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
function changeCarPrice(id, value) {
    const car = findCarById(id);
    if (car) {
        car.preco += car.preco * percent[value];
        console.log(`Price of ${car.nome} changed to ${car.preco}`);
        return car;
    }
    return undefined;
}
