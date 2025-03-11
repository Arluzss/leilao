import WebSocket, { WebSocketServer } from 'ws';
import CarModel from "./models/Car";
import { clients } from './routes/carRoutes';
// import { CarInterface } from './interface/CarInterface';

const wss = new WebSocketServer({ port: 8080 });
let fixedValue: { [key: number]: number } = { 1: 500, 2: 1000, 3: 1500, 4: 2000 };
let time = 120;

interface Session {
    userID: string | null;
    category: string | null;
    auctionID: string | null;
    client: WebSocket;
}

interface User {
    firstName: string;
    lastName: string;
}

let session: Session[] = [];
let tempSession: Session[] = [];

wss.on('connection', (ws: WebSocket, req) => {

    ws.on('message', async (message: string) => {
        let user: User = { firstName: JSON.parse(message).firstName, lastName: JSON.parse(message).lastName };
        console.log(JSON.parse(message));
        let car = await changeCarPrice(user, JSON.parse(message).category, JSON.parse(message).auctionID, JSON.parse(message).value);
        ws.send(JSON.stringify(car));
    });

    if (req.url === undefined) { return; }

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
    } else {
        tempSession.push({ auctionID, userID: '', category, client: ws });
    }

    ws.on('close', () => {
        // session = session.filter(s => s.client !== ws);
        tempSession = tempSession.filter(s => s.client !== ws);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');

interface Car {
    id: string;
    name: string;
    brand: string;
    year: number;
    logoSrc: string;
    carSrc: string;
    price: number;
    engine: string;
    time: number;
}

interface Categoria {
    popular: Car[];
    luxo: Car[];
}

// Função para listar categorias corretamente
async function findCarById(id: string): Promise<Car | undefined> {
    const carId = Number(id);
    const carCollection = await CarModel.findOne({});

    if (!carCollection) {
        return undefined;
    }

    for (const category of ['popular', 'luxo']) {
        const categoriaEncontrada = carCollection.categorias.find((cat: Record<string, any>) => cat[category]);
        if (!categoriaEncontrada) {
            continue;
        }

        const car = categoriaEncontrada[category as keyof typeof categoriaEncontrada].find((car: Record<string, any>) => car.id === carId);
        if (car) {
            return {
                id: car.id.toString(),
                name: car.name,
                brand: car.brand,
                year: car.year,
                logoSrc: car.logoSrc,
                carSrc: car.carSrc,
                price: car.price,
                engine: car.engine,
                time: 120
            };
        }
    }

    return undefined;
}

async function changeCarPrice(user: User, cate: string, id: string, value: keyof typeof fixedValue): Promise<Car | undefined> {
    //aqui ao mudar o preço, atualizar no banco de dados e adicionar ao array bid
    const carId = Number(id);
    const category = cate;
    const carCollection = await CarModel.findOne({});
    if (!carCollection) {
        return undefined;
    }


    const categoriaEncontrada = carCollection.categorias.find((cat: Record<string, any>) => cat[category]);
    if (!categoriaEncontrada) {
        return undefined;
    }
    const car = categoriaEncontrada[category as keyof typeof categoriaEncontrada].find((car: Record<string, any>) => car.id === carId);
    if (!car) {
        return undefined;
    }
    car.price += fixedValue[value];
    // Adicionar novo lance ao array de lances
    const newBid = {
        user: user.firstName + ' ' + user.lastName,
        bidAmount: car.price,
        timestamp: new Date()
    };
    console.log("price: ", car.price);
    // Atualizar o carro no banco de dados
    await CarModel.updateOne(
        { "categorias.popular.id": carId },  // Busca dentro do array corretamente
        {
            $push: { "categorias.$.popular.$[].bids": newBid }, // Atualiza corretamente o array de lances
            $set: { "categorias.$.popular.$[].price": car.price } // Atualiza o preço do carro
        }
    );

    sendNotification(`🔔 Notificação para usuário \n\n Um safado fez um lance novo, resetando o tempo do leilão \n Hora: ${new Date().toLocaleTimeString()}`);
    time = 120;
    return car;
}

const sendNotification = (message: string) => {
    console.log(clients.length);

    clients.forEach(client => {
        const clientSession = session.find(s => s.userID === client.id);
        if (!clientSession) {
            client.send(message);
        }
    });
};

async function updateTime() {
    time--;
    let car: Car | undefined;
    session.forEach(async s => {
        if (s.auctionID === null) return;
        car = await findCarById(s.auctionID);
        if (car) {
            car.time = time;
            s.client.send(JSON.stringify(car));
        }
    });

    tempSession.forEach(async s => {
        if (s.auctionID === null) return;
        car = await findCarById(s.auctionID);
        if (car) {
            car.time = time;
            s.client.send(JSON.stringify(car));
        }
    });

    if (time === 0) {
        time = 120;
        sendNotification(`🔔 Notificação para usuário \n\n O tempo do leilão acabou \n Hora: ${new Date().toLocaleTimeString()}`);
    }
}

setInterval(updateTime, 1000);