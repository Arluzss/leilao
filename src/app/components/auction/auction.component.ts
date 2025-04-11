import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../script/FakeUsers';
import { WebSocketService } from '../../services/ws/web-socket.service';
import { CarService } from '../../services/cars/car.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-auction',
  standalone: false,
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})

export class AuctionComponent implements OnInit, OnDestroy {
  showingBids: boolean = true; // Set to true to show bids by default
  showingComments: boolean = false;
  commentText: string = '';
  valueAcummuled: number = 0;
  time: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private webSocketService: WebSocketService, private carService: CarService) { }
 
  get currentCar(){
    return this.carService.currentCar;
  }

  get currentCategory() {
    return this.carService.currentCategory;
  }

  get currentCarLink() {
    return this.carService.link;
  }

  ngOnInit() {

    this.webSocketService.conectar().then(() => {
      this.webSocketService.sendMessage({
        type: 'check',
        carID: this.currentCar.id,
        userID: this.getUserFromLocalStorage()?.id,
      });
    });

    this.subscription = this.webSocketService.mensage().subscribe((message) => {
      if (message.type === 'bid' || message.type === 'check') {
        this.valueAcummuled = message.valueAcummuled;
      }
      if(message.type === 'info'){
        this.time = message.timeRemaining;
        this.valueAcummuled = message.valueAcummuled;
      }
      console.log('Received message:', message);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getUserFromLocalStorage(): User | null {
    const users = localStorage.getItem('users');
    if (users) {
      const userArray: User[] = JSON.parse(users);
      return userArray.length > 0 ? userArray[0] : null;
    }
    return null;
  }

  send(p: number) {
    const user = this.getUserFromLocalStorage();
    this.webSocketService.sendMessage({
      type: 'bid',
      userID: user?.id,
      bidOpt: p,
      carID: this.currentCar.id,
    });
  }

  showBids() {
    this.showingBids = true;
    this.showingComments = false;
  }

  showComments() {
    this.showingBids = false;
    this.showingComments = true;
  }

  sendComment() {
    const user = this.getUserFromLocalStorage();
    if (user && this.currentCar.id) {
      const comment = {
        user: user.firstName,
        text: this.commentText
      };
    }
  }

}