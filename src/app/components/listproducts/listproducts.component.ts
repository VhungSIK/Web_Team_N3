import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductAddedObserverService } from 'src/app/product-added-observer.service';
import { DeleteProductCommand } from 'src/app/command/deleteproductcommand';


@Component({
  selector: 'app-listproducts',
  templateUrl: './listproducts.component.html',
  styleUrls: ['./listproducts.component.css']
})
export class ListproductsComponent {
  products: any[] = []; // Mảng chứa thông tin sản phẩm từ Firebase
  currentUserID: string = '';
  selectedProductId: string = '';
  showNotification: boolean = false; // Biến để kiểm soát hiển thị thông báo

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
    private productAddedObserverService: ProductAddedObserverService,
    private deleteProductCommand: DeleteProductCommand

  ) {
    this.currentUserID = this.authService.userData.uid;
  }

  ngOnInit() {
    // Đăng ký nhận thông báo khi có sản phẩm mới được thêm vào
    this.productAddedObserverService.productAdded$.subscribe(() => {
      // Xử lý khi có sản phẩm mới
      console.log('Observer is working!'); // Log để kiểm tra

      // Hiển thị thông báo sản phẩm đã được thêm vào giỏ hàng
      this.showNotification = true;
      // Tắt thông báo sau một khoảng thời gian nhất định (ví dụ: 5 giây)
      setTimeout(() => {
        this.closeNotification();
      }, 5000); // Thời gian tính bằng mili giây (5000 mili giây = 5 giây)
      this.fetchProducts(); // Cập nhật lại danh sách sản phẩm khi có sản phẩm mới
    });

    if (this.authService.userData) {
      this.currentUserID = this.authService.userData.uid;
      this.fetchProducts();
    } else {
      // Nếu chưa có dữ liệu người dùng, có thể thực hiện các hành động khác tại đây
    }
  }
  deleteProduct(productId: string) {
    this.deleteProductCommand.execute(productId)
      .then(() => {
        // Xóa sản phẩm thành công, cập nhật lại danh sách sản phẩm
        this.fetchProducts();
      })
      .catch(error => {
        console.error('Lỗi khi xóa sản phẩm:', error);
      });
  }

  fetchProducts() {
    // Lấy dữ liệu sản phẩm từ Firebase Realtime Database
    this.db.list('products').valueChanges().subscribe((data: any) => {
      this.products = data;
    });
  }
  closeNotification() {
    this.showNotification = false; // Đóng thông báo
  }
}