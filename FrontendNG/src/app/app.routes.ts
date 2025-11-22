import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { ListAllRoom } from './listAllRoom/listAllRoom';
import { RoomDetails } from './roomDetails/roomDetails';
import { BookRoom } from './bookRoom/bookRoom';
import { About } from './about/about';
import { NgModule } from '@angular/core';
import { Register } from './register/register';
import { ErrorPage } from './error/error';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { CustomerDashboard } from './customer-dashboard/customer-dashboard';
import { ListAllBookings } from './listAllBookings/listAllBookings';
import { RoomManagement } from './roomManagement/roomManagement';
import { AddRoomComponent } from './addRoom/addRoom';
import { UpdateRoomComponent } from './updateRoom/updateRoom';
import { ReceptionReg } from './receptionReg/receptionReg';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'book', component: ListAllRoom },
  { path: 'roomDetails/:id', component: RoomDetails },
  { path: 'bookRoom/:id', component: BookRoom },
  { path: 'about', component: About },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'receptionReg', component: ReceptionReg },
  { path: 'adminDashboard', component: AdminDashboard },
  { path: 'admin-dashboard', component: AdminDashboard },
  { path: 'customerDashboard', component: CustomerDashboard },
  { path: 'listAllBookings', component: ListAllBookings },
  { path: 'roomManagement', component: RoomManagement },
  { path: 'admin-dashboard/room-management', component: RoomManagement },
  { path: 'addRoom', component: AddRoomComponent },
  { path: 'admin-dashboard/add-room', component: AddRoomComponent },
  { path: 'updateRoom/:id', component: UpdateRoomComponent },
  { path: 'admin-dashboard/update-room/:id', component: UpdateRoomComponent },
  
  { path: '**', component: ErrorPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
