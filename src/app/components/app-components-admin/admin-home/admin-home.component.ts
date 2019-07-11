import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdminCreateLecturerComponent } from '../admin-create-lecturer/admin-create-lecturer.component';
import { ClassUtilService } from 'src/app/services/class-util.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  constructor(private authSrv: AuthService, private router: Router, private dialog: MatDialog, private cuSrv: ClassUtilService) { }

  ngOnInit() {
    // this.cuSrv.searchClassUtil();
  }

  logout() {
    this.authSrv.logout()
    .then(
      res => {
        this.router.navigate(['/login']);
      }, 
      error => {
        console.log("Logout error", error);
      }
    );
  }

  openCreateLecturerDialog() {
    const dialogRef = this.dialog.open(AdminCreateLecturerComponent, {
      width: '50vw',
      height: '50vh'
    })
  }  
}
