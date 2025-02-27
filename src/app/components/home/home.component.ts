import { Component, OnInit } from '@angular/core';
import { Car } from '../interface/CarInterface';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  audio = new Audio('assets/audio/RidersOnTheStorm.mp3');
  imagePath = 'assets/image/Exposição.png';
  index1: number = 0;
  index2: number = 0;
  categorys: string[] = ['popular', 'luxo'];
  currentCategory: string = 'popular';
  currentCar: Car = {} as Car;
  cars: Car[] = [];
  socket: WebSocket | undefined;
  time: number = 0;

  play(): void {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      console.log('Audio is already playing');
    }
  }

  changeCategory(n: number) {
    this.index1 += n;
    if (this.categorys[this.index1]) {
      this.currentCategory = this.categorys[this.index1];
    } else {
      this.index1 = 0;
      this.currentCategory = this.categorys[this.index1];
    }
    this.fetchCars();
  }

  connectWebSocket(): void {
    let params;
    params = new URLSearchParams();
    params.set('auctionID', this.currentCar.id);
    params.set('category', this.currentCategory);
    this.socket = new WebSocket(`ws://localhost:8080?${params}`);
    
    this.socket.onopen = () => {
      console.log('WebSocket connection opened');
      console.log(this.currentCar);
    };

    this.socket.onmessage = (event) => {
      let car: Car | undefined = JSON.parse(event.data);

      if (car) {
        this.currentCar.preco = car.preco;
        this.time = car.time;
        console.log('WebSocket message received:', car);
      }
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };
  }

  closeConnection(): void {
    if (this.socket) {
      this.socket
        .close();
      }
  }

  changeCar(n: number): void {
    this.index2 += n;
    if (this.cars[this.index2]) {
      this.currentCar = this.cars[this.index2];
    } else {
      this.index2 = 0;
      this.currentCar = this.cars[this.index2];
    }
  }

  fetchCars(): void {
    fetch(`http://localhost:3000/cars/${this.currentCategory}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na requisição');
        }
        return response.json();
      }).then(data => {
        this.cars = data;
        this.currentCar = data[this.index2];
        this.connectWebSocket(); // Mova a chamada para cá
      }).catch(error => {
        console.error('Erro ao buscar carros:', error);
      });
  }

  ngOnInit(): void {
    this.fetchCars();
  }
}