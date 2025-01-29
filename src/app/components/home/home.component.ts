import { Component } from '@angular/core';
import cars from './cars.json';
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
  index: number = 0;

  categoryArr: string[] = ['popular', 'luxo'];
  currentCar: Car = {} as Car;
  cars: Car[] = [];

  play(): void {
    this.audio.play();
  }

  ngOnInit(): void {
    fetch('http://localhost:3000/cars')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na requisição');
        }
        return response.json();
      }).then(data => {
        console.log(data);
        this.cars = data;
        this.currentCar = this.cars[0];
      })
  }

  // pass(p: boolean): void {
  //   let tempCategory: string = this.category;

  //   if (p) {
  //     this.category = this.categoryArr[this.categoryArr.indexOf(this.category) - 1];
  //   } else {
  //     this.category = this.categoryArr[this.categoryArr.indexOf(this.category) + 1];
  //   }

  //   if (this.category == undefined) {
  //     this.category = tempCategory;
  //   }

  //   this.index = 0;
  //   this.update(0);
  // }

  // carPass(p: boolean): void {
  //   cars.categorias.forEach((element: any) => {
  //     if (element[this.category] != undefined) {
  //       if (p) {
  //         this.index -= 1;
  //       } else {
  //         this.index += 1;
  //       }
  //       this.update(this.index);
  //     }
  //   });
  // }

  // update(n: number): void {
  //   cars.categorias.forEach((element: any) => {
  //     if (n < 0 || n >= element[this.category].length) {
  //       n = 0;
  //       this.index = 0;
  //     }
  //     if (element[this.category] != undefined) {
  //       this.carId = element[this.category][n].id;
  //       this.carName = element[this.category][n].nome;
  //       this.price = element[this.category][n].preco;
  //       this.carImage = element[this.category][n].imagem;
  //       this.carLogo = element[this.category][n].marca;
  //     }
  //   });
  // }
}