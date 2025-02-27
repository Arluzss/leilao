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
  private userID: string | null = null;
  public category: string | null = null;
  public currentPrice: number = 0;
  public time = 0;
  prices: number[] = [0, 0, 0, 0];
  car: Car | undefined = undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.auctionId = this.route.snapshot.paramMap.get('id');
    this.category = this.route.snapshot.paramMap.get('category');
    this.connectWebSocket();
  }

  ngOnDestroy() {
    this.disconnectWebSocket();
  }

  connectWebSocket() {
    let params;
    if (this.auctionId) {
      params = new URLSearchParams();
      params.set('userID', 'da3Esdse344t');
      params.set('category', 'popular');
      params.set('auctionID', this.auctionId);
    }

    this.socket = new WebSocket(`ws://localhost:8080?${params}`);

    this.socket.onopen = (event) => {
      console.log('WebSocket connection opened:');
    };

    this.socket.onmessage = (event) => {
      this.car = JSON.parse(event.data);

      if (this.car) {
        this.currentPrice = this.car.preco;
        this.updatePrices(this.car);
        this.time = this.car.time;
        console.log('WebSocket message received:', this.car);
      }
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
        auctionID: this.auctionId,
        value: p.toString()
      }));
    } else {
      console.error('WebSocket is not open. Ready state:', this.socket ? this.socket.readyState : 'undefined');
    }
  }

  updatePrices(car: Car) {
    if (car) {
      for(let i = 0; i < this.prices.length; i++){
        this.prices[i] = car.preco + 500;
      }
    }
  }
}

interface Car {
  id: string;
      nome: string;
      brand: string;
      year: number;
      preco: number;
      engine: string;
      status?: string; // Opcional porque tem um valor padrão
      startingPrice: number;
      currentPrice: number;
      time: number;
      // bids?: Bid[]; // Lista de lances
      // comments?: Comment[]; // Lista de comentários
}