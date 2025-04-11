import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 👈 Importação necessária
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { AuctionComponent } from './components/auction/auction.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'auction', component: AuctionComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  declarations: [HomeComponent, AuctionComponent],
  imports: [RouterModule.forRoot(routes),
  RouterModule, CommonModule, FormsModule],
  exports: [RouterModule],
})

export class AppRoutingModule {}