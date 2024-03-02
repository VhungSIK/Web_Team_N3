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
  productQuantity: number = 0;
  productDetails: string = '';
  productOrigin: string = '';
  productCategory: string = '';
  productImage: string = '';

  constructor(private db: AngularFireDatabase, private router: Router) {}
  saveProduct() {
    let errorMessage = '';
  
    if (!this.productName) {
      errorMessage += '- Please enter the product name.\n';
    }
    if (!this.productDetails) {
      errorMessage += '- Please enter product details.\n';
    }

    if (!this.productCategory) {
      errorMessage += '- Please enter product category.\n';
    }
    if (!this.productImage) {
      errorMessage += '- Please enter product image URL.\n';
    }
    if (this.productPrice <= 0) {
      errorMessage += '- Product price must be greater than 0.\n';
    }
    if (this.productQuantity <= 0) {
      errorMessage += '- Product quantity must be greater than 0.\n';
    }

    if (errorMessage !== '') {
      alert('Please fix the following errors:\n' + errorMessage);
      return; // Prevent saving if information is invalid
    }
    // Tiếp tục lưu sản phẩm nếu không có lỗi
    const productData = {
      name: this.productName,
      price: this.productPrice,
      quantity: this.productQuantity,
      details: this.productDetails,
      origin: this.productOrigin,
      category: this.productCategory,
      image: this.productImage
    };
  
    const newProductRef = this.db.list('products').push(productData);
    const newProductId = newProductRef.key;
  
    newProductRef.update({ id: newProductId })
    .then(() => {
      alert('Product has been saved successfully!');
      this.router.navigate(['admin']);
    })
    .catch(error => {
      alert('An error occurred while saving the product');
      console.error('Error saving the product:', error);
    });
}
  
  resetForm() {
    // Reset các trường thông tin sản phẩm về giá trị mặc định
    this.productName = '';
    this.productPrice = 0;
    this.productQuantity = 0;
    this.productDetails = '';
    this.productOrigin = '';
    this.productCategory = '';
    this.productImage = '';
  }
}
