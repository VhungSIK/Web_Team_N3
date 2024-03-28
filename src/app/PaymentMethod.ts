import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/compat/app';

// Định nghĩa interface cho Phương thức thanh toán
interface PaymentMethod {
  createPayment(): any;
}

// Triển khai lớp DirectCheckPayment
class DirectCheckPayment implements PaymentMethod {
  createPayment(): any {
    // Trong một tình huống thực tế, phương thức này sẽ trả về dữ liệu thanh toán cụ thể cho Direct Check
    return { method: 'Direct Check', details: 'Thanh toán trực tiếp' };
  }
}

// Triển khai lớp BankTransferPayment
class BankTransferPayment implements PaymentMethod {
  createPayment(): any {
    // Trong một tình huống thực tế, phương thức này sẽ trả về dữ liệu thanh toán cụ thể cho Bank Transfer
    return { method: 'Bank Transfer', details: 'Thanh toán qua chuyển khoản ngân hàng' };
  }
}