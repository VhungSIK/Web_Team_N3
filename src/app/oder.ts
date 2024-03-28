export class Order {
    userId: string;
    orderId: string;
    date: Date;
    email: string;
    fullName: string;
    totalOrder: number;
    orderItems: { name: string, status: string, quantity: number }[] = [];
  
    constructor(userId: string, orderId: string, date: Date, email: string, fullName: string, totalOrder: number) {
      this.userId = userId;
      this.orderId = orderId;
      this.date = date;
      this.email = email;
      this.fullName = fullName;
      this.totalOrder = totalOrder;
    }
  
    addOrderItem(item: { name: string, status: string, quantity: number }) {
      this.orderItems.push(item);
    }
  
    clone(): Order {
      return new Order(this.userId, this.orderId, this.date, this.email, this.fullName, this.totalOrder);
    }
  }
  