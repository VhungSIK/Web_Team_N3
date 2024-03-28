
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductAddedObserverService {
  private productAddedSubject = new Subject<void>();

  productAdded$ = this.productAddedSubject.asObservable();

  constructor() {}

  notifyProductAdded() {
    this.productAddedSubject.next();
  }
}
