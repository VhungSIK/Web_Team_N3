import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-ordersmanagement',
  templateUrl: './ordersmanagement.component.html',
  styleUrls: ['./ordersmanagement.component.css']
})
export class OrdersmanagementComponent {
  orders: any = {};
  selectedOrders: { [key: string]: string[] } = {};
  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.db.object('orders').valueChanges().subscribe((data: any) => {
      this.orders = data || {};
      this.filterOrdersByStatus(); // Gọi hàm để lọc các đơn hàng có status là "wait"
    });
  }
  
  filterOrdersByStatus() {
    for (const userId of Object.keys(this.orders)) {
      const userOrders: { [key: string]: any } = this.orders[userId];
      for (const orderId of Object.keys(userOrders)) {
        const orderItems = userOrders[orderId]?.orderItems || [];
        const waitItems = orderItems.filter((item: { status: string }) => item.status === 'wait');
        if (waitItems.length === 0) {
          // Nếu không có item nào có status là "wait", xóa đơn hàng này
          delete this.orders[userId][orderId];
        } else {
          // Chỉ lưu lại các item có status là "wait"
          this.orders[userId][orderId].orderItems = waitItems;
        }
      }
    }
  }
  
  sortOrdersByDate() {
    for (const userId of Object.keys(this.orders)) {
      const userOrders: { [key: string]: any } = this.orders[userId];
  
      const sortedOrderIds = Object.keys(userOrders).sort((a, b) => {
        const dateA = new Date(userOrders[a].date);
        const dateB = new Date(userOrders[b].date);
        return dateA.getTime() - dateB.getTime(); // Sắp xếp từ cũ đến mới
      });
  
      const sortedOrders: { [key: string]: any } = {};
      sortedOrderIds.forEach(orderId => {
        sortedOrders[orderId] = userOrders[orderId];
      });
  
      this.orders[userId] = sortedOrders;
    }  
  }
  
  
  
  getOrderUserIds(): string[] {
    return Object.keys(this.orders || {});
  }

  getOrderIds(userId: string): string[] {
    return Object.keys(this.orders[userId] || {});
  }
  getTotalQuantity(userId: string, orderId: string): number {
    const order = this.orders[userId][orderId];
    if (Array.isArray(order?.orderItems)) {
      return order.orderItems.reduce((total: number, item: { quantity: number }) => total + (item.quantity || 0), 0);
    }
    return 0;
  }
  
  // getOrderItemsCount(userId: string, orderId: string): number {
  //   const order = this.orders[userId][orderId];
  //   if (Array.isArray(order?.orderItems)) {
  //     const itemCount = order.orderItems.length - 1;
  //     return itemCount < 0 ? 0 : itemCount;
  //   }
  //   return 0;
  // }
  updateSelectedOrders(userId: string, orderId: string) {
    if (!this.selectedOrders[userId]) {
        this.selectedOrders[userId] = [];
    }

    const index = this.selectedOrders[userId].indexOf(orderId);
    if (index === -1) {
        // Nếu orderId chưa có trong mảng selectedOrders, thêm vào mảng
        this.selectedOrders[userId].push(orderId);
    } else {
        // Nếu đã có, loại bỏ orderId khỏi mảng
        this.selectedOrders[userId].splice(index, 1);
    }
}

isSelected(userId: string, orderId: string): boolean {
    return this.selectedOrders[userId]?.includes(orderId);
}

confirmOrder(userId: string, orderId: string) {
  if (this.isSelected(userId, orderId)) {
      this.orders[userId][orderId].orderItems.forEach((item: { status: string; }) => {
          if (item.status === 'wait') {
              item.status = 'complete';
          }
      });

      this.updateOrderStatus(userId, orderId);
  }
}


updateOrderStatus(userId: string, orderId: string) {
    // Sử dụng AngularFireDatabase để cập nhật dữ liệu lên Firebase
    // Ví dụ:
    this.db.object(`orders/${userId}/${orderId}`).update(this.orders[userId][orderId]);
}

}