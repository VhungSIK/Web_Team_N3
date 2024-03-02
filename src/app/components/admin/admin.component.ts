import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  selectedUser: any;
  orders: { [userId: string]: any } = {};
    constructor(private router: Router, private authService: AuthService, private db: AngularFireDatabase) {
    this.getLimitedUsers();
  }
  
  ngOnInit() {
    this.getLimitedUsers();
    this.getOrders();
    this.db.list('orders').valueChanges().subscribe((data: any[]) => {
      this.orders = data; // Gán dữ liệu lấy được vào biến orders
      console.log('Orders from Firebase:', this.orders); 
    });
 }
 navigateToListProducts() {
  this.router.navigate(['/listproducts']); // Điều hướng đến ListproductsComponent
}
navigateToAddCouponCode() {
  this.router.navigate(['/addcouponcode']); // Điều hướng đến ListproductsComponent
}

 getTotalQuantity(userId: string, orderId: string): number {
  const order = this.orders[userId][orderId];
  if (Array.isArray(order?.orderItems)) {
    return order.orderItems.reduce((total: number, item: { quantity: number }) => total + (item.quantity || 0), 0);
  }
  return 0;
}

  showAllUsers() {
    this.router.navigate(['usermanagement']); // Chuyển sang trang User Management
  }
  showAllOrders() {
    this.router.navigate(['ordersmanagement']); // Chuyển đến trang Order Management khi click vào "Show All"
  }

  getLimitedUsers() {
    this.authService.getUsers().subscribe((users: any[]) => {
      this.users = users.filter(user => user.userType === 'user').slice(0, 5); // Chỉ hiển thị 5 người dùng có userType là 'user'
    });
  }

  toggleSelection(user: any) {
    this.selectedUser = user;
  }

  confirmSelection(user: any) {
    if (this.selectedUser) {
      this.authService.updateUserType(this.selectedUser.uid, 'admin').then(() => {
        this.getLimitedUsers(); // Lấy lại danh sách người dùng có userType là 'user' sau khi chuyển đổi
        this.selectedUser = null;
      });
    }
  }
  getOrders() {
    this.db.object('orders').valueChanges().subscribe((data: any) => {
      this.orders = data || {};
      // Sắp xếp đơn hàng theo ngày giảm dần
      Object.keys(this.orders).forEach((userId: string) => {
        const userOrders = this.orders[userId];
        const sortedOrders = Object.keys(userOrders).sort((a, b) => {
          const dateA = new Date(userOrders[a].date).getTime();
          const dateB = new Date(userOrders[b].date).getTime();
          return dateB - dateA;
        });
        // Chọn 5 đơn hàng mới nhất để hiển thị
        const latestOrders = sortedOrders.slice(0, 5);
        const limitedOrders: { [userId: string]: any } = {};
        limitedOrders[userId] = {};
        latestOrders.forEach(orderId => {
          limitedOrders[userId][orderId] = userOrders[orderId];
        });
        this.orders[userId] = limitedOrders[userId];
      });
      console.log('Orders from Firebase:', this.orders);
    });
  }
  getLimitedOrders(userId: string): any[] {
    return Object.values(this.orders[userId] || {});
  }
  
  
  getOrderUserIds(): string[] {
    return Object.keys(this.orders || {});
  }
  
  getOrderIds(userId: string): string[] {
    return Object.keys(this.orders[userId] || {});
  }
  getOrderItemsCount(userId: string, orderId: string): number {
    const order = this.orders[userId][orderId];
    if (Array.isArray(order?.orderItems)) {
      const itemCount = order.orderItems.length - 1;
      return itemCount < 0 ? 0 : itemCount;
    }
    return 0;
  }
  
  navigateToAddProduct() {
    this.router.navigate(['add-products']);
  }
}