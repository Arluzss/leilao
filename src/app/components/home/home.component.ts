import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { User } from '../../script/FakeUsers';
import { AudioService } from '../../services/audio/audio.service';
import { CarService } from '../../services/cars/car.service';
import generateUsers from '../../script/FakeUsers';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  private userId: string | undefined;

  mailIconVisible: boolean = false;
  mailIconBlinking: boolean = false;
  messageVisible: boolean = false;

  @ViewChild('textContent') textContent!: ElementRef;

  constructor(private audioService: AudioService, private carService : CarService) { }
 
  get currentCar(){
    return this.carService.currentCar;
  }

  get currentCategory() {
    return this.carService.currentCategory;
  }

  get currentCarLink() {
    return this.carService.link;
  }

  changeCategory(direction: 'previous' | 'next') {
    this.carService.changeCategory(direction);
  }

  changeCar(direction: 'previous' | 'next') {
    this.carService.changeCar(direction);
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

  closeConnection(): void {
    let audio = new Audio('assets/audio/FE_COMMON_MB_05.wav');
    audio.volume = 0.1;
    audio.play();
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
    }

    this.audioService.playAudio('assets/audio/RidersOnTheStorm.mp3');
    this.audioService.isPlaying();
  }

}