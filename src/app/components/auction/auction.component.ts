import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../script/FakeUsers';

@Component({
  selector: 'app-auction',
  standalone: false,
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})

export class AuctionComponent implements OnInit, OnDestroy {
  private socket: WebSocket | undefined;
  private auctionId: string | null = null;
  public category: string | null = null;
  public currentPrice: number = 0;
  public time = 100; // Example initial time
  public progress: number = 100; // Initial progress set to 100%
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

  getUserFromLocalStorage(): User | null {
    const users = localStorage.getItem('users');
    if (users) {
      const userArray: User[] = JSON.parse(users);
      return userArray.length > 0 ? userArray[0] : null;
    }
    return null;
  }

  connectWebSocket() {
    let params;
    if (this.auctionId) {
      params = new URLSearchParams();
      params.set('category', this.category || '');
      params.set('auctionID', this.auctionId);
      const user = this.getUserFromLocalStorage();
      if (user) {
        params.set('userID', user?.id.toString());
        params.set('userName', user?.firstName);
        params.set('lastName', user?.lastName);
      }
    }

    this.socket = new WebSocket(`ws://localhost:8080?${params}`);

    this.socket.onopen = (event) => {
      console.log('WebSocket connection opened:');
    };

    this.socket.onmessage = (event) => {
      this.car = JSON.parse(event.data);
      
      if (this.car) {
        this.currentPrice = this.car.price;
        this.updatePrices(this.car);
        this.time = this.car.time;
        this.progress = (this.time / 100) * 100; // Update progress based on time
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
      const user = this.getUserFromLocalStorage();
      this.socket.send(JSON.stringify({
        auctionID: this.auctionId,
        value: p.toString(),
        firstName: user?.firstName,
        lastName: user?.lastName,
        category: this.category
      }));
    } else {
      console.error('WebSocket is not open. Ready state:', this.socket ? this.socket.readyState : 'undefined');
    }
  }

  updatePrices(car: Car) {
    if (car) {
      for(let i = 0; i < this.prices.length; i++){
        this.prices[i] = car.price + 500;
      }
    }
  }
}

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