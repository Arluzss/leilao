import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuctionComponent } from './components/auction/auction.component';
import { CommonModule } from '@angular/common';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'auction/:category/:id', component: AuctionComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  declarations: [HomeComponent, AuctionComponent],
  imports: [RouterModule.forRoot(routes),
  RouterModule, CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}