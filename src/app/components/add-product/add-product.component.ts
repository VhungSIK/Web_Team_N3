import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  productId: string = '';
  productName: string = '';
  productPrice: number = 0;
  productDetails: string = '';
  productOrigin: string = '';
  productCategory: string = '';
  productImage: string = '';

  constructor(private db: AngularFireDatabase, private router: Router) {}

  saveProduct() {
    const productData = {
      id: this.productId,
      name: this.productName,
      price: this.productPrice,
      details: this.productDetails,
      origin: this.productOrigin,
      category: this.productCategory,
      image: this.productImage
    };

    const newProductRef = this.db.list('products').push(productData); // Thêm sản phẩm vào Firebase và lấy tham chiếu mới được tạo
    const newProductId = newProductRef.key; // Lấy ID mới được tạo từ tham chiếu
  
    // Sử dụng ID mới để cập nhật thuộc tính productId
    newProductRef.update({ id: newProductId })
      .then(() => {
        alert('Sản phẩm đã được lưu thành công!');
        this.router.navigate(['admin']);
      })
      .catch(error => {
        alert('Đã xảy ra lỗi khi lưu sản phẩm');
        console.error('Lỗi khi lưu sản phẩm:', error);
      });
    }

  resetForm() {
    // Reset các trường thông tin sản phẩm về giá trị mặc định
    this.productName = '';
    this.productPrice = 0;
    this.productDetails = '';
    this.productOrigin = '';
    this.productCategory = '';
    this.productImage = '';
  }
}
