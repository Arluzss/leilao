import { Component } from '@angular/core';
import { Car } from '../interface/CarInterface'

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  audio = new Audio('assets/audio/RidersOnTheStorm.mp3');
  imagePath = 'assets/image/Exposição.png';
  index1: number = 0;
  index2: number = 0;
  categorys: string[] = ['popular', 'luxo'];
  currentCategory: string = 'popular';
  currentCar: Car = {} as Car;
  cars: Car[] = [];
  percent: { [key: number]: number } = { 1: 0.10, 2: 0.20, 3: 0.30, 4: 0.40 };

  play(): void {
    this.audio.play();
  }

  changeCategory(n:number){
    this.index1 += n;
    if(this.categorys[this.index1]){
      this.currentCategory = this.categorys[this.index1];
    }else{
      this.index1 = 0;
      this.currentCategory = this.categorys[this.index1];
    }
    this.fetchCars();
  }

  changeCar(n: number): void {
    this.index2 += n;
    if (this.cars[this.index2]) {
      this.currentCar = this.cars[this.index2];
    }else{
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
      })
  }

  ngOnInit(): void {
    this.fetchCars();
  }
}