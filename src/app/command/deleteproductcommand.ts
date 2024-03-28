import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class DeleteProductCommand {
  constructor(private db: AngularFireDatabase) {}

  execute(productId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const confirmDelete = window.confirm('Bạn có chắc muốn xóa sản phẩm này?');

      if (confirmDelete) {
        this.db.object(`products/${productId}`).remove()
          .then(() => {
            resolve(); // Xóa thành công
          })
          .catch(error => {
            reject(error); // Xóa thất bại
          });
      } else {
        // Hủy xóa: không thực hiện hành động nào
        resolve();
      }
    });
  }
}
