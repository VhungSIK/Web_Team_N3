import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUserID: string = '';
  products: any[] = []; // Mảng chứa thông tin sản phẩm từ Firebase
  userData: any = {};

  constructor(private db: AngularFireDatabase, private authService: AuthService, private router: Router) {
    this.currentUserID = this.authService.userData.uid;
  }

  ngOnInit() {
    this.authService.observeUserData().subscribe((userData: any) => {
      this.userData = userData;
      if (this.userData) {
        this.currentUserID = this.userData.uid; // Assign currentUserID here if needed

        this.authService.getUserDataByUserId(this.userData.uid).subscribe((userDataById: any) => {
          this.userData.rank = userDataById.rank;
          this.userData.rankName = this.getRankNameFromPoints(this.userData.rank);
        });
      }
    });

    this.fetchProducts();
  }

  fetchProducts() {
    // Lấy dữ liệu sản phẩm từ Firebase Realtime Database
    this.db.list('products').valueChanges().subscribe((data: any) => {
      this.products = data;
    });
  }
  
  fetchUserData() {
    // Lấy thông tin người dùng từ AuthService
    this.authService.observeUserData().subscribe((userData: any) => {
      this.userData = userData;
      if (this.userData) {
        this.authService.getUserDataByUserId(this.userData.uid).subscribe((userDataById: any) => {
          this.userData.rank = userDataById.rank; // Lấy thông tin rank từ userDataById
          this.userData.rankName = this.getRankNameFromPoints(this.userData.rank);

        });
      }
    });
  }
  logOut() {
    this.authService.logOut();
  }
  getRankNameFromPoints(points: number): string {
    if (points <= 20000) {
      return 'Đồng';
    } else if (points <= 50000) {
      return 'Vàng';
    } else {
      return 'Kim cương';
    }
  }
  goToCart() {
    this.router.navigate(['/cart', this.currentUserID]); // Chuyển hướng đến trang giỏ hàng khi click vào nút "cart"
  }
}
