import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, Router } from '@angular/router';

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
      this.userIdFromRouteParams = params['userId'];
      this.db.object(`products/${this.productId}`).valueChanges().subscribe((product: any) => {
        this.product = product;
      });
    });
  }

  addToCart() {
    if (this.product.quantity <= 0) {
      alert('Sản phẩm đã hết hàng');
      return;
    }

    if (this.quantity > this.product.quantity) {
      alert('Không đủ số lượng sản phẩm');
      return;
    }

    const productData = {
      id: this.productId,
      name: this.product.name,
      image: this.product.image,
      quantity: this.quantity,
      price: this.product.price,
      status: 'wait'
    };

    const remainingQuantity = this.product.quantity - this.quantity;

    if (this.userIdFromRouteParams) {
      const cartItemsRef = this.db.list(`cartItems/${this.userIdFromRouteParams}`);

      cartItemsRef.query.ref.orderByChild('name').equalTo(productData.name).once('value', snapshot => {
        const existingItem = snapshot.val();

        if (existingItem) {
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
                  console.log('Updated product quantity in cart successfully');
                  this.updateRemainingQuantity(remainingQuantity);
                })
                .catch((error) => {
                  console.error('Error updating product quantity in cart:', error);
                });
            }
          });

          if (!foundWaitItem) {
            cartItemsRef.push(productData)
              .then(() => {
                console.log('Added product to cart successfully');
                this.updateRemainingQuantity(remainingQuantity);
              })
              .catch((error) => {
                console.error('Error adding product to cart:', error);
              });
          }
        } else {
          cartItemsRef.push(productData)
            .then(() => {
              console.log('Added product to cart successfully');
              this.updateRemainingQuantity(remainingQuantity);
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

  updateRemainingQuantity(remainingQuantity: number) {
    this.db.object(`products/${this.productId}`).update({ quantity: remainingQuantity })
      .then(() => {
        console.log('Updated product quantity on Firebase successfully');
        this.db.object(`products/${this.productId}`).valueChanges().subscribe((product: any) => {
          this.product = product;
        });
        this.router.navigate(['cart', this.userIdFromRouteParams]);
      })
      .catch((error) => {
        console.error('Error updating product quantity on Firebase:', error);
      });
  }
}
