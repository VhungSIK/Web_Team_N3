import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.css']
})
export class EditproductComponent {
  productId: string = '';
  productName: string = '';
  productPrice: number = 0;
  productQuantity: number = 0;
  productDetails: string = '';
  productOrigin: string = '';
  productCategory: string = '';
  productImage: string = '';
  constructor(private route: ActivatedRoute, private db: AngularFireDatabase, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = params['id']; // Lấy id sản phẩm từ URL
      if (productId) {
        this.fetchProduct(productId);
      }
    });
  }

  fetchProduct(productId: string) {
    this.db.object(`products/${productId}`).valueChanges().subscribe((data: any) => {
      if (data) {
        this.productId = productId;
        this.productName = data.name;
        this.productOrigin = data.origin;
        this.productPrice = data.price;
        this.productQuantity = data.quantity;
        this.productCategory = data.category;
        this.productImage = data.image;
        this.productDetails = data.details;

      }
    });
  }
  saveProduct() {
    const updatedProductData = {
      name: this.productName,
      price: this.productPrice,
      quantity: this.productQuantity,
      details: this.productDetails,
      origin: this.productOrigin,
      category: this.productCategory,
      image: this.productImage
    };

    this.db.object(`products/${this.productId}`).update(updatedProductData)
      .then(() => {
        alert('Sản phẩm đã được cập nhật thành công!');
        this.router.navigate(['/listproducts']); // Chuyển hướng về trang danh sách sản phẩm sau khi lưu thành công
      })
      .catch(error => {
        alert('Đã xảy ra lỗi khi cập nhật sản phẩm');
        console.error('Lỗi khi cập nhật sản phẩm:', error);
      });
  }
}
