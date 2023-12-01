import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/product.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId!: string;
  userIdFromRouteParams!: string;
  quantity: number = 1;
  product: any;
  cartItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private router: Router
  ) {}

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.userIdFromRouteParams = params['userId']; // Lấy userId từ route params
      // Lấy thông tin sản phẩm từ Firebase theo productId
      this.db.object(`products/${this.productId}`).valueChanges().subscribe((product: any) => {
        this.product = product;
      });
    });
  }
  addToCart() {
    const productData = {
      name: this.product.name,
      image: this.product.image,
      quantity: this.quantity,
      price: this.product.price,
      status: 'wait'
      // Add other product details if needed
    };
  
    if (this.userIdFromRouteParams) {
      const cartItemsRef = this.db.list(`cartItems/${this.userIdFromRouteParams}`);
  
      cartItemsRef.query.ref.orderByChild('name').equalTo(productData.name).once('value', snapshot => {
        const existingItem = snapshot.val();
  
        if (existingItem) {
          // Loop through existing items to check for status
          const existingKeys = Object.keys(existingItem);
          let foundWaitItem = false;
          existingKeys.forEach(itemKey => {
            const existingStatus = existingItem[itemKey].status;
            if (existingStatus === 'wait') {
              foundWaitItem = true;
              const currentQuantity = existingItem[itemKey].quantity || 0;
              const newQuantity = currentQuantity + productData.quantity;
  
              cartItemsRef.update(itemKey, { quantity: newQuantity })
                .then(() => {
                  console.log('Updated product quantity successfully');
                  this.router.navigate(['cart', this.userIdFromRouteParams]);
                })
                .catch((error) => {
                  console.error('Error updating product quantity:', error);
                });
            }
          });
  
          if (!foundWaitItem) {
            // If no 'wait' status found for the product name, add a new product
            cartItemsRef.push(productData)
              .then(() => {
                console.log('Added product to cart successfully');
                this.router.navigate(['cart', this.userIdFromRouteParams]);
              })
              .catch((error) => {
                console.error('Error adding product to cart:', error);
              });
          }
        } else {
          // If product doesn't exist in the cart, add a new product
          cartItemsRef.push(productData)
            .then(() => {
              console.log('Added product to cart successfully');
              this.router.navigate(['cart', this.userIdFromRouteParams]);
            })
            .catch((error) => {
              console.error('Error adding product to cart:', error);
            });
        }
      });
    } else {  
      console.error('UserId not found in route params');
    }
  }  
}