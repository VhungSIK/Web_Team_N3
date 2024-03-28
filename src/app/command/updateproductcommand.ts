import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class UpdateProductCommand {
  constructor(private db: AngularFireDatabase) {}

  execute(productId: string, updatedProductData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.object(`products/${productId}`).update(updatedProductData)
        .then(() => {
          resolve(); // Cập nhật thành công
        })
        .catch(error => {
          reject(error); // Cập nhật thất bại
        });
    });
  }
}
