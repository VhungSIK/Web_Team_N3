import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-cartuser',
  templateUrl: './cartuser.component.html',
  styleUrls: ['./cartuser.component.css']
})
export class CartuserComponent implements OnInit {
  userCart: any[] = [];
  currentUserID: string = '';

  constructor(private db: AngularFireDatabase, private authService: AuthService) {
    this.currentUserID = this.authService.userData.uid;
  }

  ngOnInit() {
    // Lấy giỏ hàng của người dùng hiện tại
    this.getUserCart();
  }

  getUserCart() {
    // Lấy danh sách sản phẩm trong giỏ hàng từ Firebase Realtime Database
    this.db.list(`cartItems/${this.currentUserID}`).valueChanges().subscribe((data: any[]) => {
      this.userCart = data;
    });
  }
}
