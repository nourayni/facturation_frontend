import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProductComponent } from './components/product/product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { FactureComponent } from './components/facture/facture.component';
import { FactureDetailComponent } from './components/facture-detail/facture-detail.component';

export const routes: Routes = [
    {path: 'register', component:RegisterComponent},
    {path: 'login', component:LoginComponent},
    {path: 'products', component:ProductComponent},
    {path: 'products/:id', component:ProductDetailComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path:'facture', component:FactureComponent},
    {path:'facture/:id', component:FactureDetailComponent}

];