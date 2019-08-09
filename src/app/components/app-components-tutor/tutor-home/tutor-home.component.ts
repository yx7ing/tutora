import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { Application } from 'src/app/models/application';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tutor-home',
  templateUrl: './tutor-home.component.html',
  styleUrls: ['./tutor-home.component.css']
})
export class TutorHomeComponent implements OnInit {

  currentUser: User;
  applications: Application[];

  displayedColumns: string[] = ['course', 'lic', 'licemail', 'inttime', 'intstatus', 'status'];
  dataSource;

  constructor(private authSrv: AuthService, private router: Router, private fbSrv: FirebaseService) { }

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        this.currentUser = response;
        this.fbSrv.searchApplications(response.email);
      }
    );

    this.fbSrv.getApplications().subscribe(
      response => {
        this.applications = response;
        this.dataSource = new MatTableDataSource(this.applications);
      }
    );
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

}
