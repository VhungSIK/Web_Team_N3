import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PriceCalculatorDecorator {
  calculateTotalPrice(cartItems: any[]): number {
    // Tính toán tổng giá tiền của các sản phẩm trong giỏ hàng
    let totalPrice = 0;
    cartItems.forEach(item => {
      item.totalPricePerItem = item.price * item.quantity;
      totalPrice += item.totalPricePerItem;
    });
    return totalPrice;
  }
}
