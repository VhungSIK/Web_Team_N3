import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css']
})
export class UsermanagementComponent implements OnInit {
  allUsers: any[] = [];
  selectedUser: any;

  constructor(private router: Router,private authService: AuthService) {
    this.getAllUsers();
  }

  getAllUsers() {
    this.authService.getUsers().subscribe((users: any[]) => {
      this.allUsers = users.filter(user => user.userType === 'user'); // Lọc người dùng có userType là 'user'
    });
  }
  
  toggleSelection(user: any) {
    this.selectedUser = user;
  }

  confirmSelection(user: any) {
    if (this.selectedUser) {
      this.authService.updateUserType(this.selectedUser.uid, 'admin').then(() => {
        this.getAllUsers(); // Lấy lại danh sách người dùng có userType là 'user' sau khi chuyển đổi
        this.selectedUser = null;
      });
    }
  }

  ngOnInit() {
    this.getAllUsers();
    // Thực hiện các tác vụ khởi tạo khác nếu cần
  }
}
