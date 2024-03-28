import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageProxyService {
  constructor() {}

  // Hàm kiểm tra và tải ảnh
  loadImage(url: string): Promise<boolean> {
    // Ghi log bắt đầu tải ảnh
    console.log('Starting to load image from URL:', url);
    
    // Thực hiện kiểm tra và tải ảnh
    return new Promise<boolean>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Ghi log khi ảnh được tải thành công
        console.log('Image loaded successfully from URL:', url);
        resolve(true);
      };
      img.onerror = () => {
        // Ghi log khi có lỗi xảy ra trong quá trình tải ảnh
        console.error('Error loading image from URL:', url);
        reject(false);
      };
      img.src = url;
    });
  }
}
