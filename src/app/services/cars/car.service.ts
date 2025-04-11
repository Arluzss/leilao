import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../../models/car.model';

@Injectable({
  providedIn: 'root'
})

export class CarService {
  private apiUrl = 'http://localhost:4500/';

  private category: string[] = ['popular', 'luxo'];
  private carByCategory: { [category: string]: Car[] } = {};
  private currentCategoryIndex: number = 0;
  private currentCarIndex: number = 0;
  private linkMap: { [rel: string]: string } = {};

  constructor(private http: HttpClient) {
    this.filterCarsByCategory();
  }

  private getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl + 'cars/all');
  }

  private filterCarsByCategory(): void {
    this.getCars().subscribe((cars) => {
      this.category.forEach((cat) => {
        this.carByCategory[cat] = cars.filter((car) => car.category === cat);
      });
    });
  }

  public changeCategory(direction: 'previous' | 'next') {
    if (direction === 'previous' && this.currentCategoryIndex > 0) {
      this.currentCategoryIndex--;
    } else if (direction === 'next' && this.currentCategoryIndex < this.category.length - 1) {
      this.currentCategoryIndex++;
    }
  }

  public changeCar(direction: 'previous' | 'next') {
    if (direction === 'previous' && this.currentCarIndex > 0) {
      this.currentCarIndex--;
    } else if (direction === 'next' && this.currentCarIndex < this.listCurrentCarsByCategory.length - 1) {
      this.currentCarIndex++;
    }
  }

  private carLinks(): void {
    this.linkMap = Object.fromEntries(
      this.currentCar.links?.map((link) => [link.rel, this.apiUrl + link.href]) || []
    );
  }

  get currentCategory(): string {
    return this.category[this.currentCategoryIndex];
  }

  get listCurrentCarsByCategory(): Car[] {
    return this.carByCategory[this.currentCategory] || [];
  }

  get currentCar(): Car {
    return this.listCurrentCarsByCategory[this.currentCarIndex] || null;
  }
  
  get link(): { [rel: string]: string } {
    if (!this.currentCar) {
      return {};
    }
    this.carLinks();
    return this.linkMap;
  }
}
