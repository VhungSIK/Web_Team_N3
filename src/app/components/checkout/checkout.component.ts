import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/compat/app';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  userId: string = '';
  userName: string = '';
  totalPrice: number = 0;
  totalPricePerItem: number[] = [];
  cartItems: any[] = [];
  paymentMethodSelected: boolean = false;

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase) {}
  placeOrder() {
    const directCheckElement = document.getElementById('directcheck') as HTMLInputElement;  
    const firstNameInput = document.querySelector('input[placeholder="John"]') as HTMLInputElement;
    const lastNameInput = document.querySelector('input[placeholder="Doe"]') as HTMLInputElement;
    const emailInput = document.querySelector('input[placeholder="example@email.com"]') as HTMLInputElement;
    const MobileNoInput = document.querySelector('input[placeholder="+123 456 789"]') as HTMLInputElement;
    const AddressLine1Input = document.querySelector('input[placeholder="123 Street"]') as HTMLInputElement;
    const AddressLine2Input = document.querySelector('input[placeholder="1234 Street"]') as HTMLInputElement;
    const CountryInput = document.querySelector('.custom-select') as HTMLSelectElement;
    const CityInput = document.querySelector('input[placeholder="New York"]') as HTMLInputElement;
    const StateInput = document.querySelector('input[placeholder="New York1"]') as HTMLInputElement;
    const ZIPCodeInput = document.querySelector('input[placeholder="123"]') as HTMLInputElement;


    if (!directCheckElement || !firstNameInput || !lastNameInput) {
      // Kiểm tra nếu không tìm thấy các phần tử trên giao diện người dùng
      console.log('Không thể tìm thấy phần tử trên giao diện người dùng.');
      return;
    }

    const directCheck = directCheckElement.checked;
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;
    const mobieNo = MobileNoInput.value;
    const addresss = AddressLine1Input.value;
    const adress2 = AddressLine2Input.value;
    const country = CountryInput.value;
    const city = CityInput.value;
    const state = StateInput.value;
    const zipcode = ZIPCodeInput.value;
    const userId = this.userId;
    const database = this.db.database;

    if (!directCheck) {
      window.alert('Vui lòng chọn phương thức thanh toán.');
      return;
    } else {
      this.paymentMethodSelected = true; // Đánh dấu rằng đã chọn phương thức thanh toán
    }

    // Tiếp tục với quy trình đặt hàng
    database.ref('orders/' + userId).push({
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobieNo: mobieNo,
      addresss: addresss,
      adress2: adress2,
      country: country,
      city: city,
      state: state,
      zipcode: zipcode,
      totalPrice: this.totalPrice, // Lấy giá trị từ biến totalPrice
      timestamp: firebase.database.ServerValue.TIMESTAMP // Thêm timestamp
    }).then(() => {
      console.log('Order saved to Firebase!');
      const cartItemsRef = database.ref(`cartItems/${userId}`);
      cartItemsRef.once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
          const key: string | null = childSnapshot.key;

      // Kiểm tra và cập nhật trạng thái sản phẩm
      if (key !== null) {
        const item = childSnapshot.val();

        // Kiểm tra và cập nhật trạng thái sản phẩm
        if (item.status === 'wait') {
          cartItemsRef.child(key).update({ status: 'complete' })
              .then(() => {
                console.log('Updated product status successfully');
              })
              .catch(error => {
                console.error('Error updating product status:', error);
              });
            }
          }
        });
      });
    }).catch((error) => {
      console.error('Error saving order:', error);
    });
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.userName = params['userName'];
      if (this.userId) {
        this.fetchCartItems();
      }
    });
    this.route.queryParams.subscribe(params => {
      this.totalPrice = params['totalPrice'];
      this.totalPricePerItem = params['totalPricePerItem'];
    });
  }

  calculateShippingFee(totalPrice: number): number {
    const shippingFeePerTen = 0.5;
    const shippingFee = Math.floor(totalPrice / 10) * shippingFeePerTen;
    return shippingFee;
  }

  fetchCartItems() {
    this.db.list(`cartItems/${this.userId}`).valueChanges().subscribe((items: any[]) => {
      this.cartItems = items.map((item: any) => {
        item.totalPricePerItem = item.price * item.quantity;
        return item;
      });
      
      this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.totalPricePerItem, 0);
      const shippingFee = this.calculateShippingFee(this.totalPrice);

      // Thêm mục phí vận chuyển vào giỏ hàng
      this.cartItems.push({
        price: shippingFee,
        quantity: 1,
      });
    });  
  }
}
