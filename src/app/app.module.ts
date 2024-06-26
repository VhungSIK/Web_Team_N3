import { UpdateProductCommand } from './command/updateproductcommand';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './components/admin/admin.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsermanagementComponent } from './components/usermanagement/usermanagement.component';
import { OrdersmanagementComponent } from './components/ordersmanagement/ordersmanagement.component';
import { ListproductsComponent } from './components/listproducts/listproducts.component';
import { EditproductComponent } from './components/editproduct/editproduct.component';
import { AddcouponcodeComponent } from './components/addcouponcode/addcouponcode.component';
import { OrderstatusComponent } from './components/orderstatus/orderstatus.component';
import { ProductAddedObserverService } from './product-added-observer.service';
import { CartuserComponent } from './components/cartuser/cartuser.component'; // Import service 
import { ImageProxyService } from './ImageProxyService';  
import { DiscountDecorator } from './decorator/discountDecorator';
import { PriceCalculatorDecorator } from './decorator/priceCalculatorDecorator';
import { DeleteProductCommand } from './command/deleteproductcommand';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    AdminComponent,
    AddProductComponent,
    DashboardComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    UsermanagementComponent,
    OrdersmanagementComponent,
    ListproductsComponent,
    EditproductComponent,
    AddcouponcodeComponent,
    OrderstatusComponent,
    CartuserComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireDatabaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    

    // error solution NullInjectError
    AngularFireModule.initializeApp(environment.firebase),
      BrowserAnimationsModule
      
  ],
  providers: [ProductAddedObserverService],
  bootstrap: [AppComponent]
})
export class AppModule { }
