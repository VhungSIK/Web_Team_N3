import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private db: AngularFireDatabase) {} // Inject AngularFireDatabase để thao tác với cơ sở dữ liệu Firebase
  getProductById(productId: string): Observable<any> {
    return this.db.object(`products/${productId}`).valueChanges();
  }
}