import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Car } from '../interface/CarInterface';
import generateUsers from '../../script/FakeUsers';
import { User } from '../../script/FakeUsers';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {
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

  mailIconVisible: boolean = false;
  mailIconBlinking: boolean = false;
  messageVisible: boolean = false; // Add this line

  @ViewChild('textContent') textContent!: ElementRef;

  constructor(private audioService: AudioService) {}

  startNotifications(): void {
    if (this.userId) {
      this.eventSource = new EventSource(`http://localhost:3000/cars/notification/${this.userId}`);
      console.log('EventSource created', this.userId);
      this.eventSource.onmessage = event => {
        if (this.audioService.isPlaying()) {
          // If music is playing, do not display the notification
          return;
        }

        const audio = new Audio('assets/audio/FE_COMMON_MB_16.wav');
        audio.volume = 0.1;
        audio.play();
        this.mailIconVisible = true;
        this.mailIconBlinking = true;
        this.messageVisible = false; // Ensure message is hidden when a new notification arrives

        const eventData = JSON.parse(event.data);
        let message = '';
        if (eventData.type === 'bid') {
          message = `🔔 Notificação: Um novo lance foi feito. Tempo do leilão resetado. Hora: ${eventData.message.split('Hora: ')[1]}`;
        } else if (eventData.type === 'end') {
          message = `🔔 Notificação: O tempo do leilão acabou. Hora: ${eventData.message.split('Hora: ')[1]}`;
        }
        console.log('message:', message);
        this.updateMessageContent(message);
      };
    }
  }

  updateMessageContent(message: string): void {
    const user = this.getUserFromLocalStorage();
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Usuário';
    const formattedMessage = `<p>De: Sistema</p><p>Para: ${userName}</p><p>${message}</p>`;

    if (this.textContent) {
      this.textContent.nativeElement.innerHTML = formattedMessage;
    } else {
      setTimeout(() => this.updateMessageContent(message), 100);
    }
  }

  handleMailIconClick(): void {
    this.mailIconBlinking = false;
    this.messageVisible = true; // Show the message when the mail icon is clicked
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
    audio.volume = 0.1;
    audio.play();
    if (this.socket) {
      this.socket.close();
    }
  }

  changeCar(n: number): void {
    if (n == 1) {
      let audio = new Audio('assets/audio/FE_COMMON_MB_01.wav');
      audio.volume = 0.1;
      audio.play();
    } else {
      let audio = new Audio('assets/audio/FE_COMMON_MB_02.wav');
      audio.volume = 0.1;
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
    if (this.socket) {
      this.closeConnection();
    }
    else {
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

    // Automatically play the music when the component initializes
    this.audioService.playAudio('assets/audio/RidersOnTheStorm.mp3');
    this.audioService.isPlaying();
  }

  ngOnDestroy(): void {
    this.eventSource?.close();
  }
}