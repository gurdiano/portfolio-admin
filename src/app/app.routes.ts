import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { authGuard } from './services/auth/auth-guard';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'home', component: Home, canActivate: [authGuard]},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', redirectTo: 'login'}
];
