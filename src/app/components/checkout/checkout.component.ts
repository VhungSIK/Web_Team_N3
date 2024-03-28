import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, Router } from '@angular/router';
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
  discountPrice: number = 0;
  totalPricePerItem: number[] = [];
  total: number = 0;
  totalOrder: number = 0; // Khởi tạo thuộc tính để lưu tổng đơn hàng
  cartItems: any[] = [];
  paymentMethodSelected: boolean = false;
  showBankTransferImage: boolean = false; // Thuộc tính để kiểm soát việc hiển thị hình ảnh

  

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase, private router: Router, private zone: NgZone) {}
  placeOrder() {
    const directCheckElement = document.getElementById('directcheck') as HTMLInputElement;  
    const fullNameInput = document.querySelector('input[placeholder="John"]') as HTMLInputElement;
    const totalOrder = this.calculateTotal();
    const AddressLine1Input = document.querySelector('input[placeholder="123 Street"]') as HTMLInputElement;
    const AddressLine2Input = document.querySelector('input[placeholder="1234 Street"]') as HTMLInputElement;
    const CountryInput = document.querySelector('.custom-select') as HTMLSelectElement;
    const StateInput = document.querySelector('input[placeholder="New York1"]') as HTMLInputElement;
    const ZIPCodeInput = document.querySelector('input[placeholder="123"]') as HTMLInputElement;
    const fullNameValue = fullNameInput.value.trim();
    const address1Value = AddressLine1Input.value.trim();
    const address2Value = AddressLine2Input.value.trim();
    const zipCodeValue = ZIPCodeInput.value.trim();
    const stateValue = StateInput.value.trim();
  
    const zipCodeRegex = /^\d{9,10}$/;
    const stateRegex = /^[a-zA-Z\s]{2,}$/;
    const bankTransfer = document.getElementById('banktransfer') as HTMLInputElement;
    if (directCheckElement && bankTransfer) {
      if (directCheckElement.checked) {
        this.paymentMethodSelected = true;
        this.showBankTransferImage = false; // Không hiển thị hình ảnh khi chọn direct check
      } else if (bankTransfer.checked) {
        this.paymentMethodSelected = true;
        this.showBankTransferImage = true; // Hiển thị hình ảnh khi chọn bank transfer
      } else {
        this.paymentMethodSelected = false;
        this.showBankTransferImage = false; // Mặc định không hiển thị hình ảnh
      }
    }
    if (!directCheckElement || !fullNameValue) {
      alert('Please enter your full name.');
      return;
    }
  
    if (!address1Value || !address2Value) {
      alert('Please enter Address Line 1 and Address Line 2.');
      return;
    }
  
    const stateEntered = !!stateValue.trim();
    const zipEntered = !!zipCodeValue.trim();
  
    if ((stateEntered && !zipEntered) || (!stateEntered && zipEntered)) {
      alert('Please enter both Full Name and Mobile No or leave both fields empty.');
      return;
    }
  
    if (stateValue && !stateRegex.test(stateValue)) {
      alert('Please enter Full Name with letters only and at least 2 words.');
      return;
    }
  
    if (zipCodeValue && !zipCodeRegex.test(zipCodeValue)) {
      alert('Please enter a Mobile No Code with 9 to 10 digits.');
      return;
    }
  
    if (!directCheckElement) {
      alert('Please select a payment method.');
      return;
    } else {
      this.paymentMethodSelected = true;
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
      orderItems: this.cartItems,
      totalOrder: totalOrder
    });
    
    newOrderRef.then((snapshot) => {
      const orderId = snapshot.key;
      console.log('New Order ID:', orderId);
    
      return database.ref(`cartItems/${userId}`).once('value');
    }).then((snapshot) => {
      snapshot.forEach(childSnapshot => {
        const key: string | null = childSnapshot.key;
        const item = childSnapshot.val();
        const totalOrder = this.calculateTotal();
        const userRef = database.ref(`users/${userId}`);
        userRef.once('value', (snapshot) => {
          const userData = snapshot.val();
          let currentRank = userData.rank || 0;
          currentRank = parseInt(currentRank);
          
          const newRank = currentRank + totalOrder; // Add totalOrder to current rank
          userRef.update({ rank: newRank }); // Update the new rank in Firebase
        
          console.log('Updated Rank:', newRank);
        });
      
        if (key !== null && item.status === 'wait') {
          console.log(`Found item with key: ${key} and status: ${item.status}`);
          database.ref(`cartItems/${userId}/${key}`).update({ status: 'complete' })
            .then(() => {
              console.log('Updated product status successfully');
// Sau khi xử lý đặt hàng thành công
            })
            .catch(error => {
              console.error('Error updating product status:', error);

            });

        }
        this.zone.run(() => {
          this.router.navigate(['/orderstatus']); // Chuyển hướng đến trang thông báo đơn hàng
      });      
      });
    }).catch((error) => {
      console.error('Error saving order:', error);
    });
  }    
  // fetchUserRank(userId: string) {
  //   this.db.object(`users/${userId}/rank`).valueChanges().subscribe((userRank: any) => {
  //     console.log('User Rank:', userRank); // Kiểm tra giá trị rank của người dùng
  //     if (userRank) {
  //       this.applyShippingDiscount(userRank); // Áp dụng chiết khấu phí vận chuyển dựa trên rank
  //     }
  //   });
  // }
  // applyShippingDiscount(userRank: number) {
  //   const totalPrice = this.totalPrice; // Tổng giá trị đơn hàng
  //   let shippingFee = this.calculateShippingFee(totalPrice); // Phí vận chuyển ban đầu
  
  //   if (userRank < 20000) {
  //     // Nếu rank dưới 20000, không thay đổi phí vận chuyển
  //     // Phí vận chuyển vẫn giữ nguyên
  //   } else if (userRank >= 20000 && userRank <= 50000) {
  //     // Nếu rank từ 20000 đến 50000, giảm 25% phí vận chuyển
  //     shippingFee *= 0.75;
  //   } else {
  //     // Nếu rank trên 50000, không tính phí vận chuyển
  //     shippingFee *= 0;
  //   }
  
  //   // Tính tổng giá trị đơn hàng sau khi áp dụng chiết khấu
  //   this.totalOrder = totalPrice + shippingFee - this.discountPrice;
  // }
  
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.userName = params['userName'];
      this.userEmail = params['userEmail'];
      // this.fetchUserRank(this.userId);

      if (this.userId) {
        this.fetchCartItems();
        this.fetchUserData();
      }
    });
    this.route.queryParams.subscribe(params => {
      this.totalPrice = params['totalPrice'];
      this.totalPricePerItem = params['totalPricePerItem'];
      this.discountPrice = params['discountPrice'] || 0;
      console.log('Discount Price:', this.discountPrice); 
      this.total = this.calculateTotal();
      const couponName = params['appliedCoupon'];
      if (couponName) {
        console.log('Applied coupon:', couponName);
      }
  
      console.log('Checkout Page Data:', {
        userId: this.userId,
        userName: this.userName,
        userEmail: this.userEmail,
        totalPrice: this.totalPrice,
        totalPricePerItem: this.totalPricePerItem,
        discountPrice: this.discountPrice,
        total: this.total,
        couponName: couponName
      });
    });
  }
  updateBankTransferImageVisibility() {
    const bankTransfer = document.getElementById('banktransfer') as HTMLInputElement;
    if (bankTransfer) {
        this.showBankTransferImage = bankTransfer.checked;
    }
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
  calculateTotal() {
    const shippingFee = this.calculateShippingFee(this.totalPrice);
    const total = this.totalPrice + shippingFee - this.discountPrice;
    return total;
  }
  
}  