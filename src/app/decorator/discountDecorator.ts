import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiscountDecorator {
  applyDiscount(totalPrice: number, discountPrice: number): number {
    // Áp dụng giảm giá và trả về giá tiền mới sau khi áp dụng giảm giá
    return totalPrice - discountPrice;
  }
}
