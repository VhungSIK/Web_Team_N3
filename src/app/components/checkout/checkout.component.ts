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
  userEmail: string = '';
  userPhone: string = '';
  totalPrice: number = 0;
  totalPricePerItem: number[] = [];
  cartItems: any[] = [];
  paymentMethodSelected: boolean = false;

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase) {}
  placeOrder() {
    const directCheckElement = document.getElementById('directcheck') as HTMLInputElement;  
    const fullNameInput = document.querySelector('input[placeholder="John"]') as HTMLInputElement;

    const AddressLine1Input = document.querySelector('input[placeholder="123 Street"]') as HTMLInputElement;
    const AddressLine2Input = document.querySelector('input[placeholder="1234 Street"]') as HTMLInputElement;
    const CountryInput = document.querySelector('.custom-select') as HTMLSelectElement;
    const StateInput = document.querySelector('input[placeholder="New York1"]') as HTMLInputElement;
    const ZIPCodeInput = document.querySelector('input[placeholder="123"]') as HTMLInputElement;
  
    if (!directCheckElement || !fullNameInput ) {
      console.log('Không thể tìm thấy phần tử trên giao diện người dùng.');
      return;
    }
  
    const directCheck = directCheckElement.checked;
    const fullName = this.userName; // Sử dụng dữ liệu userName đã có
    const email = this.userEmail; // Sử dụng dữ liệu userEmail đã có
    const mobieNo = this.userPhone;
    const addresss = AddressLine1Input.value;
    const adress2 = AddressLine2Input.value;
    const country = CountryInput.value;
    const state = StateInput.value;
    const zipcode = ZIPCodeInput.value;
    const userId = this.userId;
    const currentDate = new Date(); // Lấy ngày và giờ hiện tại
    const day = currentDate.getDate(); // Lấy ngày trong tháng (1-31)
    const month = currentDate.getMonth() + 1; // Lấy tháng (0-11), cần cộng thêm 1 vì tháng bắt đầu từ 0
    const year = currentDate.getFullYear(); // Lấy năm
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`; // Định dạng ngày tháng

    const database = this.db.database;
  
    if (!directCheck) {
      window.alert('Vui lòng chọn phương thức thanh toán.');
      return;
    } else {
      this.paymentMethodSelected = true;
    }
  
    const newOrderRef = database.ref('orders/' + userId).push({
      fullName: fullName,
      email: email,
      mobieNo: mobieNo,
      addresss: addresss,
      adress2: adress2,
      country: country,
      state: state,
      zipcode: zipcode,
      totalPrice: this.totalPrice,
      date: formattedDate,
      orderItems: this.cartItems
    });
    newOrderRef.then((snapshot) => {
      const orderId = snapshot.key;
      console.log('New Order ID:', orderId);
    
      return database.ref(`cartItems/${userId}`).once('value');
    }).then((snapshot) => {
      snapshot.forEach(childSnapshot => {
        const key: string | null = childSnapshot.key;
        const item = childSnapshot.val();
      
        if (key !== null && item.status === 'wait') {
          console.log(`Found item with key: ${key} and status: ${item.status}`);
          database.ref(`cartItems/${userId}/${key}`).update({ status: 'complete' })
            .then(() => {
              console.log('Updated product status successfully');
            })
            .catch(error => {
              console.error('Error updating product status:', error);
            });
        }
      });
      
    }).catch((error) => {
      console.error('Error saving order:', error);
    });
  }    
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.userName = params['userName'];
      this.userEmail = params['userEmail'];
      console.log('User Name:', this.userName); // Thêm dòng này để kiểm tra giá trị của userName

      if (this.userId) {
        this.fetchCartItems();
        this.fetchUserData();
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
  fetchUserData() {
    this.db.object(`users/${this.userId}`).valueChanges().subscribe((userData: any) => {
      console.log('User Data:', userData); // Kiểm tra giá trị của userData
      if (userData) {
        this.userEmail = userData.email;
        this.userName = userData.userName; // Gán userName từ dữ liệu người dùng
        this.userPhone = userData.phone; // Gán userName từ dữ liệu người dùng
        console.log('User Name from database:', this.userName); // Kiểm tra giá trị của userName từ cơ sở dữ liệu Firebase
      }
    });  
  }
  fetchCartItems() {
    this.db.list(`cartItems/${this.userId}`).valueChanges().subscribe((items: any[]) => {
      const waitItems = items.filter((item: any) => item.status === 'wait'); // Lọc ra các sản phẩm có trạng thái 'wait'
  
      let totalQuantity = 0; // Tính tổng số lượng sản phẩm
      this.cartItems = waitItems.map((item: any) => {
        item.totalPricePerItem = item.price * item.quantity;
        totalQuantity += item.quantity; // Tổng số lượng sản phẩm
  
        return item;
      });
  
      this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.totalPricePerItem, 0);
      const shippingFee = this.calculateShippingFee(this.totalPrice);
  
      // Tính tổng số lượng sản phẩm và phí vận chuyển
      const quantityAll = totalQuantity; // Tổng số lượng sản phẩm tính cả phí vận chuyển
  
      // Thêm mục phí vận chuyển vào cartItems
      this.cartItems.push({
        price: shippingFee,
        quantityAll: quantityAll,
      });
  
      // Lưu quantityAll lên Firebase
      this.db.object(`cartItems/${this.userId}/quatityAll`).set(quantityAll)
        .then(() => {
          console.log('quatityAll updated successfully');
        })
        .catch(error => {
          console.error('Error updating quatityAll:', error);
        });
    });
  }  
}  