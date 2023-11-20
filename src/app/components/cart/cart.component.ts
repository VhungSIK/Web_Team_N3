import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  userId: string = ''; // Biến lưu trữ userId được truyền từ ProductDetailComponent
  totalPrice: number = 0;
  constructor(private route: ActivatedRoute, private db: AngularFireDatabase) {}

  ngOnInit() {
    // Lấy userId từ route params khi trang được khởi tạo
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      if (this.userId) {
        this.fetchCartItems(); // Nếu có userId, thực hiện lấy các sản phẩm trong giỏ hàng
      }
    });
  }

  fetchCartItems() {
    // Lấy thông tin các sản phẩm trong giỏ hàng từ Firebase theo userId
    this.db.list(`cartItems/${this.userId}`).valueChanges().subscribe((items: any) => {
      this.cartItems = items;
      this.calculateTotalPrice();
    });
  }
  calculateTotalPrice() {
    // Reset giá tổng
    this.totalPrice = 0;

    // Tính giá tổng từ danh sách sản phẩm trong giỏ hàng
    this.cartItems.forEach(item => {
      const productPrice = item.price * item.quantity;
      this.totalPrice += productPrice; 
    });
    this.cartItems.forEach(item => {
      item.totalPricePerItem = item.price * item.quantity;
      this.totalPrice += item.totalPricePerItem;
    });
    
  }
  updateQuantity() {
    this.calculateTotalPrice(); // Gọi hàm tính tổng giá sau khi cập nhật số lượng
  }
  checkout() {
    // Thực hiện quá trình thanh toán, xử lý các bước cần thiết
    // Ví dụ: chuyển đến trang thanh toán, xóa giỏ hàng sau khi thanh toán, vv.
  }
}