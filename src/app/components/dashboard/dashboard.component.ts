import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  currentUserID: string = '';
  products: any[] = []; // Mảng chứa thông tin sản phẩm từ Firebase

  constructor(private db: AngularFireDatabase, private authService: AuthService) {
    this.currentUserID = this.authService.userData.uid;
  }

  ngOnInit() {
    this.fetchProducts();
    }

  fetchProducts() {
    // Lấy dữ liệu sản phẩm từ Firebase Realtime Database
    this.db.list('products').valueChanges().subscribe((data: any) => {
      this.products = data;
    });
  }
  

  logOut() {
    this.authService.logOut();
  }
}
