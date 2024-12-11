import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auction',
  standalone: false,
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})

export class AuctionComponent implements OnInit, OnDestroy {
  private socket: WebSocket | undefined;
  private auctionId: string | null = null;
  car: Car | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.auctionId = this.route.snapshot.paramMap.get('id');
    this.connectWebSocket();
  }

  ngOnDestroy() {
    this.disconnectWebSocket();
  }

  connectWebSocket() {
    let params;
    if (this.auctionId) {
      params = new URLSearchParams();
      params.set('id', this.auctionId);
    }

    this.socket = new WebSocket(`ws://localhost:8080?${params}`);

    this.socket.onopen = (event) => {
      console.log('WebSocket connection opened:');
    };

    this.socket.onmessage = (event) => {
      this.car = JSON.parse(event.data);
      console.log('Received:', this.car);
      // console.log('Received:', event.data);
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };
  }

  disconnectWebSocket() {
    if (this.socket) {
      this.socket.close();
    }
  }

  send(p: number) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        id: this.auctionId,
        value: p.toString()
      }));
    } else {
      console.error('WebSocket is not open. Ready state:', this.socket ? this.socket.readyState : 'undefined');
    }
  }
}

interface Car {
  id: number;
  nome: string;
  marca: string;
  preco: number;
  imagem: string;
}