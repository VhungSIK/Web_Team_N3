import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addcouponcode',
  templateUrl: './addcouponcode.component.html',
  styleUrls: ['./addcouponcode.component.css']
})
export class AddcouponcodeComponent {
  couponName: string = '';
  quantity: number = 0;
  discountPrice: number = 0;

  constructor(private db: AngularFireDatabase, private router: Router) {}
  saveCoupon() {
    let errorMessage = '';
  
    if (!this.couponName) {
      errorMessage += '- Please enter the coupon name.\n';
    }
  
    if (isNaN(this.quantity) || this.quantity <= 0) {
      errorMessage += '- Coupon quantity must be a positive number.\n';
    }
  
    if (isNaN(this.discountPrice) || this.discountPrice <= 0) {
      errorMessage += '- Discount price must be a positive number.\n';
    }
  
    if (errorMessage !== '') {
      alert('Please fix the following errors:\n' + errorMessage);
      return; // Prevent saving if information is invalid
    }
  
    // Continue saving coupon information if no errors
    const couponData = {
      couponName: this.couponName,
      quantity: this.quantity,
      discountPrice: this.discountPrice
    };
  
    const newCouponRef = this.db.list('coupons').push(couponData);
    const newCouponId = newCouponRef.key;
  
    newCouponRef.update({ id: newCouponId })
      .then(() => {
        alert('Coupon information has been saved successfully!');
        this.router.navigate(['admin']);
      })
      .catch(error => {
        alert('An error occurred while saving coupon information');
        console.error('Error saving coupon information:', error);
      });
  }
  
  resetForm() {
    this.couponName = '';
    this.quantity = 0;
    this.discountPrice = 0;
  }
}
