import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartuserComponent } from './cartuser.component';

describe('CartuserComponent', () => {
  let component: CartuserComponent;
  let fixture: ComponentFixture<CartuserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartuserComponent]
    });
    fixture = TestBed.createComponent(CartuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
