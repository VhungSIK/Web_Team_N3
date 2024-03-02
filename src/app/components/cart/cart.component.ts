import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  userId: string = ''; // Biến lưu trữ userId được truyền từ ProductDetailComponent
  totalPrice: number = 0;
  discountPrice: number = 0;
  couponApplied: boolean = false;
  appliedCouponName: string = '';
  calculatedTotal: number = 0
  constructor(private route: ActivatedRoute, private db: AngularFireDatabase, private router: Router) {}

  ngOnInit() {
    // Lấy userId từ route params khi trang được khởi tạo
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      if (this.userId) {
        this.fetchCartItems(); // Nếu có userId, thực hiện lấy các sản phẩm trong giỏ hàng
      }
    });
  }
  removeItem(item: any) {
    const itemId = item.productId;
    const itemRef = this.db.object(`cartItems/${this.userId}/${itemId}`);
    
    itemRef.remove()
      .then(() => {
        console.log('Item removed from Firebase successfully');
        this.fetchCartItems(); // Sau khi xóa, lấy lại danh sách cartItems từ Firebase
      })
      .catch((error) => {
        console.error('Error removing item from Firebase:', error);
      });
  }
  fetchCartItems() {
    // Lấy thông tin các sản phẩm trong giỏ hàng từ Firebase theo userId
    this.db.list(`cartItems/${this.userId}`).valueChanges().subscribe((items: any[]) => {
      this.cartItems = items;
      this.cartItems = items.filter(item => item.status === 'wait');
      this.calculateTotalPrice();
    });
  }
  calculateTotalPrice() {
    this.totalPrice = 0;
  
    this.cartItems.forEach(item => {
      item.totalPricePerItem = item.price * item.quantity;
      this.totalPrice += item.totalPricePerItem;
    });
  }
  
  updateQuantity() {
    this.calculateTotalPrice(); // Gọi hàm tính tổng giá sau khi cập nhật số lượng
  }
  checkout() {
    if (this.userId) {
      const totalAmount = this.totalPrice - this.discountPrice;
      console.log('Total Amount:', totalAmount);
      console.log('Total Price:', this.totalPrice);
      console.log('Discount Price:', this.discountPrice);
      console.log('Applied Coupon:', this.appliedCouponName);
      
      // Truyền giá giảm giá (nếu có) hoặc truyền 0 nếu không có giảm giá
      const queryParams = this.discountPrice !== 0 ? { 
        totalPrice: this.totalPrice,
        totalAmount: totalAmount,
        discountPrice: this.discountPrice,
        totalPricePerItem: this.cartItems.map(item => item.totalPricePerItem),
        appliedCoupon: this.appliedCouponName

      } : { 
        totalPrice: this.totalPrice,
        totalAmount: totalAmount,
        discountPrice: 0,
        totalPricePerItem: this.cartItems.map(item => item.totalPricePerItem),
        appliedCoupon: this.appliedCouponName
      };
  
      this.router.navigate(['/checkout', this.userId], { queryParams });
    }
  }
 
  increaseQuantity(item: any) {
    item.quantity++;
    this.calculateTotalPrice();
  }
  
  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotalPrice();
    }
  }

  
  applyCoupon(couponName: string) { 
    if (this.couponApplied) {
      // Nếu mã đã được áp dụng, thông báo cho người dùng và không thực hiện áp dụng mã nữa
      alert('Discount code has been applied!');
      return;
    }
  
    this.db.list('coupons').valueChanges().subscribe((coupons: any[]) => {
      const foundCoupon = coupons.find(coupon => coupon.couponName === couponName);
  
      if (foundCoupon) {
        // Áp dụng mã giảm giá và cập nhật lại calculatedTotal
        this.discountPrice = foundCoupon.discountPrice;
        const totalPriceAfterDiscount = this.totalPrice - this.discountPrice;
        this.calculatedTotal = totalPriceAfterDiscount;
  
        // Lưu tên mã giảm giá đã áp dụng
        this.appliedCouponName = couponName;
  
        // Thông báo mã giảm giá đã được áp dụng thành công và cập nhật lại tổng giá
        alert(` Discount code ${couponName} has been applied successfully!`);
        console.log('Discount Price:', this.discountPrice);
        console.log('Valid coupon entered:', couponName);

  
      } else {
        // Nếu không tìm thấy mã giảm giá, thông báo mã không hợp lệ
        alert(`Invalid discount code ${couponName}!`);
      }
    });
  }
  
}