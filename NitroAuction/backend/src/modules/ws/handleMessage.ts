import { WebSocket } from 'ws';
import { auctionManager } from '../auction/auction.service';

export function handleMessage(ws: WebSocket, message: string) {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'bid') {
        const { userID, bidOpt, carID } = parsedMessage;
        if (auctionManager.auctionExists(carID) && !auctionManager.hasStarted(carID)) {
            auctionManager.startAuction(carID);
            console.log('Auction started for car ID:', carID);
        }
        auctionManager.getAuction(carID)?.addClient(ws, userID, bidOpt, carID);
        auctionManager.getAuction(carID)?.bidding(userID, bidOpt);
    }

    if (parsedMessage.type === 'check') {
        console.log('check', parsedMessage);
        if (!parsedMessage.userID || !parsedMessage.carID) {
            return;
        }

        const { userID, carID } = parsedMessage;

        auctionManager.getAuction(carID)?.addClient(ws, userID, 0, carID);
        auctionManager.getAuction(carID)?.checkInfo(userID);
    }

    if (parsedMessage.type === 'comment') {
        const { userID, comment } = parsedMessage;
    }
}