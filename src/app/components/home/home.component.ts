import { Component, OnInit } from '@angular/core';
import { Car } from '../interface/CarInterface';
import generateUsers from '../../script/FakeUsers';
import { User } from '../../script/FakeUsers';

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

  private userId: string | undefined;
  private eventSource: EventSource | undefined;

  startNotifications(): void {
    if (this.userId) {
      this.eventSource = new EventSource(`http://localhost:3000/cars/notification/${this.userId}`);
      console.log('EventSource created', this.userId);
      this.eventSource.onmessage = event => {
        const audio = new Audio('assets/audio/FE_COMMON_MB_16.wav');
        audio.volume = 0.1;
        audio.play();
        console.log(event.data);
      };
    }
  }

  play(): void {
    if (localStorage.getItem('isPlaying') == 'false') {
      this.audio.play();
      localStorage.setItem('isPlaying', 'true');
    } else {
      console.log('A música já está tocando.');
    }
  }

  changeCategory(n: number) {
    if (n == 1) {
      let audio = new Audio('assets/audio/FE_COMMON_MB_01.wav');
      audio.volume = 0.1;
      audio.play();
    } else {
      let audio = new Audio('assets/audio/FE_COMMON_MB_02.wav');
      audio.volume = 0.1;
      audio.play();
    }
    
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
        this.currentCar.price = car.price;
        this.time = car.time;
        console.log('WebSocket message received:', car);
      }
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };
  }

  closeConnection(): void {
    let audio = new Audio('assets/audio/FE_COMMON_MB_05.wav');
    audio.volume = 0.2;
    audio.play();
    if (this.socket) {
      this.socket
        .close();
    }
  }

  changeCar(n: number): void {
    if (n == 1) {
      let audio = new Audio('assets/audio/FE_COMMON_MB_01.wav');
      audio.volume = 0.2;
      audio.play();
    } else {
      let audio = new Audio('assets/audio/FE_COMMON_MB_02.wav');
      audio.volume = 0.2;
      audio.play();
    }
    this.index2 += n;
    if (this.cars[this.index2]) {
      this.currentCar = this.cars[this.index2];
    } else {
      this.index2 = 0;
      this.currentCar = this.cars[this.index2];
    }
    this.fetchCars();
  }

  openAndClose(): void {
    if(this.socket){
      this.closeConnection();
    }
    else{
      this.connectWebSocket();
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
        console.log(this.currentCar.logoSrc);
        if (this.socket) {
          this.closeConnection();
        }
        this.connectWebSocket(); // Mova a chamada para cá
      }).catch(error => {
        console.error('Erro ao buscar carros:', error);
      });
  }

  getUserFromLocalStorage(): User | null {
    const users = localStorage.getItem('users');
    if (users) {
      const userArray: User[] = JSON.parse(users);
      return userArray.length > 0 ? userArray[0] : null;
    }
    return null;
  }

  ngOnInit(): void {
    generateUsers(1);
    const user = this.getUserFromLocalStorage();
    if (user) {
      this.userId = user.id.toString();
      this.startNotifications();
    }
    this.fetchCars();
  }
}