import WebSocket from 'ws';

export interface Client {
    ws: WebSocket;
    userID: string | null;
    bidOpt: number;
    carId?: number;
}
