import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AdminComponent } from './components/admin/admin.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { UsermanagementComponent } from './components/usermanagement/usermanagement.component';
import { OrdersmanagementComponent } from './components/ordersmanagement/ordersmanagement.component';
import { ListproductsComponent } from './components/listproducts/listproducts.component';
import { EditproductComponent } from './components/editproduct/editproduct.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'cart/:userId', component: CartComponent }, 
  { path: 'add-products', component: AddProductComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'checkout/:userId', component: CheckoutComponent },
  { path: 'ordersmanagement', component: OrdersmanagementComponent }, // Đường dẫn và component cho Order Management
  { path: 'usermanagement', component: UsermanagementComponent },
  { path: 'listproducts', component: ListproductsComponent },
  { path: 'editproduct/:id', component: EditproductComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
