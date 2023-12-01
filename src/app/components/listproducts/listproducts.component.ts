import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-listproducts',
  templateUrl: './listproducts.component.html',
  styleUrls: ['./listproducts.component.css']
})
export class ListproductsComponent {
  products: any[] = []; // Mảng chứa thông tin sản phẩm từ Firebase
  currentUserID: string = '';
  selectedProductId: string = '';


  constructor(private db: AngularFireDatabase, private authService: AuthService) {
    this.currentUserID = this.authService.userData.uid;
  }

  ngOnInit() {
    // Kiểm tra nếu authService đã có dữ liệu người dùng
    if (this.authService.userData) {
      this.currentUserID = this.authService.userData.uid;
      this.fetchProducts();
    } else {
      // Nếu chưa có dữ liệu người dùng, có thể thực hiện các hành động khác tại đây
    }
  }
  deleteProduct(productId: string) {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa sản phẩm này?');
  
    if (confirmDelete) {
      // Xác nhận xóa: thực hiện xóa từ Firebase Realtime Database
      this.db.object(`products/${productId}`).remove()
        .then(() => {
          // Xóa thành công, cập nhật lại danh sách sản phẩm
          this.fetchProducts();
        })
        .catch(error => {
          console.error('Lỗi khi xóa sản phẩm:', error);
        });
    } else {
      // Hủy xóa: không thực hiện hành động nào
      // Có thể không cần làm gì ở đây nếu không muốn thực hiện hành động cụ thể
    }
  }
  

  fetchProducts() {
    // Lấy dữ liệu sản phẩm từ Firebase Realtime Database
    this.db.list('products').valueChanges().subscribe((data: any) => {
      this.products = data;
    });
  }
}