import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdminCreateLecturerComponent } from '../admin-create-lecturer/admin-create-lecturer.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user';
import { UserLecturer } from 'src/app/models/userLecturer';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  lecturers: UserLecturer[];

  constructor(private authSrv: AuthService, private router: Router, private dialog: MatDialog, private fbSrv: FirebaseService) { }

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        this.fbSrv.searchLecturers(response.email);
      }
    )

    this.fbSrv.getLecturers().subscribe(
      response => {
        this.lecturers = response;
      }
    )
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
