import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProductComponent } from './components/product/product.component';

export const routes: Routes = [
    {path: 'register', component:RegisterComponent},
    {path: 'login', component:LoginComponent},
    {path: 'products', component:ProductComponent}

];
