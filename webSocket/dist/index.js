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
let percent = { '1': 0.10, '2': 0.20, '3': 0.30, '4': 0.40 };
wss.on('connection', (ws, req) => {
    console.log('New client connected');
    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);
        let car = changePrice(Number(JSON.parse(message).id), JSON.parse(message).value);
        ws.send(JSON.stringify(car));
    });
    ws.on('close', () => {
        console.log('Client has disconnected');
    });
    if (req.url === undefined) {
        return;
    }
    const url = new URL(req.url, `http://${req.headers.host}`);
    const query = new URLSearchParams(url.search);
    ws.send(JSON.stringify(findCarById(Number(query.get('id')))));
});
console.log('WebSocket server is running on ws://localhost:8080');
const rawData = fs.readFileSync('src/Cars.json', 'utf-8');
const carData = JSON.parse(rawData);
function findCarById(id) {
    for (const categoria of carData.categorias) {
        const car = categoria.popular.find(car => car.id === id) || categoria.luxo.find(car => car.id === id);
        if (car) {
            return car;
        }
    }
    return undefined;
}
function changePrice(id, value) {
    const car = findCarById(id);
    if (car) {
        car.preco += car.preco * percent[value];
        console.log(`Price of ${car.nome} changed to ${car.preco}`);
        return car;
    }
    return undefined;
}
