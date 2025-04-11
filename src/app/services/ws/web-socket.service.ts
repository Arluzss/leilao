import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private mensagens$ = new Subject<any>();

  conectar(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        return resolve();
      }

      this.socket = new WebSocket('ws://localhost:8080');

      this.socket.onopen = () => {
        console.log('Conectado ao WebSocket');
        this.isConnected = true;
        resolve();
      }

      this.socket.onerror = (error) => {
        console.error('Erro ao conectar ao WebSocket:', error);
        this.isConnected = false;
        reject(error);
      };

      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.mensagens$.next(message);
      };
      
    });
  }

  mensage(): Observable<any> {
    return this.mensagens$.asObservable();
  }

  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open. Unable to send message:', message);
    }
  }

}
