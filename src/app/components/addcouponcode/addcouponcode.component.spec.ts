import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcouponcodeComponent } from './addcouponcode.component';

describe('AddcouponcodeComponent', () => {
  let component: AddcouponcodeComponent;
  let fixture: ComponentFixture<AddcouponcodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddcouponcodeComponent]
    });
    fixture = TestBed.createComponent(AddcouponcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
