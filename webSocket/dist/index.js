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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const fs = __importStar(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const wss = new ws_1.WebSocketServer({ port: 8080 });
let percent = { 1: 500, 2: 1000, 3: 1500, 4: 2000 };
let time = 0;
let session = [];
let tempSession = [];
dotenv_1.default.config();
mongoose_1.default
    .connect(process.env.MONGO_URI || "")
    .then(() => {
    console.log("Conectado ao MongoDB");
})
    .catch((err) => console.error("Erro ao conectar ao MongoDB", err));
wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
        let car = changeCarPrice(JSON.parse(message).auctionID, JSON.parse(message).value);
        ws.send(JSON.stringify(car));
    });
    if (req.url === undefined) {
        return;
    }
    const url = new URL(req.url, `http://${req.headers.host}`);
    const query = new URLSearchParams(url.search);
    const userID = query.get('userID');
    const auctionID = query.get('auctionID');
    const category = query.get('category');
    if (userID && userID.length > 0) {
        // Remover a primeira ocorrência do cliente com um auctionID diferente
        const existingSessionIndex = session.findIndex(s => s.client === ws && s.auctionID !== auctionID);
        if (existingSessionIndex !== -1) {
            session.splice(existingSessionIndex, 1);
        }
        if (!session.some(s => s.auctionID === auctionID && s.userID === userID && s.category === category)) {
            session.push({ auctionID, userID, category, client: ws });
        }
    }
    else {
        // Remover a primeira ocorrência do cliente com um auctionID diferente
        const existingTempSessionIndex = tempSession.findIndex(s => s.client === ws && s.auctionID !== auctionID);
        if (existingTempSessionIndex !== -1) {
            tempSession.splice(existingTempSessionIndex, 1);
        }
        tempSession.push({ auctionID, userID: '', category, client: ws });
    }
    ws.on('close', () => {
        // Remover o cliente da sessão quando ele se desconectar
        session = session.filter(s => s.client !== ws);
        tempSession = tempSession.filter(s => s.client !== ws);
        console.log('WebSocket connection closed');
    });
});
console.log('WebSocket server is running on ws://localhost:8080');
const rawData = fs.readFileSync('src/Cars.json', 'utf-8');
const carData = JSON.parse(rawData); // Corrigindo a tipagem
// Função para listar categorias corretamente
function findCarById(id) {
    for (const categoria of carData[0].categorias) {
        for (const car of categoria.popular) {
            if (car.id == id) {
                return car;
            }
        }
        for (const car of categoria.luxo) {
            if (car.id == id) {
                return car;
            }
        }
    }
    console.log(`Car with ID ${id} not found`);
    return undefined;
}
function changeCarPrice(id, value) {
    //aqui ao mudar o preço, atualizar no banco de dados e adicionar ao array bid
    const car = findCarById(id);
    if (car) {
        car.preco += percent[value];
        return car;
    }
    return undefined;
}
function updateTime() {
    time++;
    let car;
    session.forEach(s => {
        if (s.auctionID === null)
            return;
        car = findCarById(s.auctionID);
        if (car) {
            car.time = time;
            s.client.send(JSON.stringify(car));
        }
    });
    tempSession.forEach(s => {
        if (s.auctionID === null)
            return;
        car = findCarById(s.auctionID);
        if (car) {
            car.time = time;
            s.client.send(JSON.stringify(car));
        }
    });
}
setInterval(updateTime, 1000);
