import WebSocket from 'ws';
import { Client } from '../client/client.model';
import { Car } from '../car/car.model';
import { carService } from '../car/car.service';

const ValueMapping = {
    1: 500,
    2: 1000,
    3: 1500,
    4: 2000
};

class AuctionManager {
    private auctions: Map<number, Auction> = new Map();
    private cars: Car[] = [];

    constructor() {
        carService
            .getAllCars()
            .then(cars => {
                this.cars = cars as Car[];
                this.cars.forEach(car => {
                    this.auctions.set(car.id, new Auction(car.id));
                });
            })
    }

    startAuction(auctionId: number): void {
        const auction = this.getAuction(auctionId);
        console.log('Auction started for car ID:', auctionId);
        if (auction) {
            auction.start(() => this.removeAuction(auctionId));
        }
    }

    removeAuction(auctionId: number): void {
        const auction = this.auctions.get(auctionId);
        if (auction) {
            auction.endAuction();
            this.auctions.delete(auctionId);
        }
    }

    listAuctions(): Auction[] {
        return Array.from(this.auctions.values());
    }

    getAuction(auctionId: number): Auction | undefined {
        return this.auctions.get(auctionId);
    }

    auctionExists(auctionId: number): boolean {
        console.log('Auction exists:', auctionId, this.auctions.has(auctionId));
        return this.auctions.has(auctionId);
    }
    hasStarted(auctionId: number): boolean {
        const auction = this.auctions.get(auctionId);
        if (auction) {
            console.log('Auction has started:', auctionId, auction.isStarted());
            return auction.isStarted();
        }
        return false;
    }
}

class Auction {
    private carId?: number;
    private clients: Client[] = [];
    private timer: NodeJS.Timeout | null = null;
    private interval: NodeJS.Timeout | null = null;
    private startTime: number = Date.now(); // Tempo de início do leilão
    private timeInSeconds: number = 120 * 1000; //
    private valueAcummuled: number = 0;
    private started: boolean = false;

    constructor(carID?: number) {
        this.carId = carID;
        console.log('Auction created for car ID:', carID);
    }

    public addClient(ws: WebSocket, userID: string | null, bidOpt: number, carId?: number) {
        const client: Client = { ws, userID, bidOpt, carId };

        if (this.clients.some(c => c.userID === userID)) {
            return;
        }

        this.clients.push(client);
    }

    public bidding(userID: string | null, bidOpt: keyof typeof ValueMapping): void {
        const client = this.clients.find(c => c.userID === userID);
        if (client) {
            const value = ValueMapping[bidOpt];
            if (value) {
                this.valueAcummuled += value;
                this.startTime = Date.now(); // Reinicia o tempo de início do leilão
            }
            this.sendNotificationToClients(1);
        } else {
        }
    }

    timeRemaining(): number {
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = this.timeInSeconds - elapsedTime;
        return Math.round(Math.max(0, remainingTime) / 1000); // Retorna o tempo restante em segundos
    }

    start(callBack: () => void): void {
        console.log('Auction started:', this.carId);
        this.timer = setTimeout(() => {
            callBack();
        }, this.timeInSeconds);

        this.interval = setInterval(() => this.sendMessageToClients(), 1000); // Atualiza a cada segundo
    }

    endAuction(): void {
        this.sendNotificationToClients(0);
        carService.removeCarByID(this.carId!)
            .then(() => {
                clearInterval(this.interval!);
            });
    }

    sendMessageToClients(): void {
        this.clients.forEach(client => {
            client.ws.send(JSON.stringify({
                type: 'info',
                carId: this.carId,
                timeRemaining: this.timeRemaining(), // Converte para segundos
                valueAcummuled: this.valueAcummuled
            }));
        });
    }

    sendNotificationToClients(n: number): void {
        if (n == 0) {
            this.clients.forEach(client => {
                client.ws.send(JSON.stringify({ type: 'finish', valueAcummuled: this.valueAcummuled }));
            });
        }

        if (n == 1) {
            this.clients.forEach(client => {
                client.ws.send(JSON.stringify({ type: 'bid', valueAcummuled: this.valueAcummuled }));
            });
        }
    }

    checkInfo(userID: string): void {
        const client = this.clients.find(c => c.userID === userID);
        if (client) {
            client.ws.send(JSON.stringify({ type: 'check', id: this.carId, isStarted: this.isStarted(), valueAcummuled: this.valueAcummuled }));
        }
    }

    isStarted(): boolean {
        return this.started;
    }

}

export const auctionManager = new AuctionManager();