import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { Application } from 'src/app/models/application';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatTableDataSource } from '@angular/material/table';
import { ClassModel } from 'src/app/models/classModel';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-tutor-home',
  templateUrl: './tutor-home.component.html',
  styleUrls: ['./tutor-home.component.css']
})
export class TutorHomeComponent implements OnInit {

  currentUser: User;
  classes: ClassModel[];
  applications: Application[];

  classColumns: string[] = ['course', 'type', 'details', 'lic'];
  classDataSource;
  @ViewChild("sortClasses", {static: true}) sortClasses: MatSort; 

  applicationColumns: string[] = ['course', 'lic', 'licemail', 'inttime', 'intstatus', 'status'];
  applicationDataSource;
  @ViewChild("sortApplications", {static: true}) sortApplications: MatSort;

  constructor(private authSrv: AuthService, private router: Router, private fbSrv: FirebaseService) { }

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        this.currentUser = response;
        this.fbSrv.searchApplications(response.email);
        this.fbSrv.searchTutorClasses(response.email);
      }
    );

    this.fbSrv.getApplications().subscribe(
      response => {
        this.applications = response;
        this.applicationDataSource = new MatTableDataSource(this.applications);
        this.applicationDataSource.sort = this.sortApplications;
      }
    );

    this.fbSrv.getTutorClasses().subscribe(
      response => {
        this.classes = response;
        this.classDataSource = new MatTableDataSource(this.classes);
        this.classDataSource.sort = this.sortClasses;
      }
    )
  }

  checkClassesLength() {
    if (this.classes == null) {
      return true;
    } else {
      if (this.classes.length == 0) {
        return true;
      } else {
        return false;
      }
    }
  }
  checkApplicationsLength() {
    if (this.applications == null) {
      return true;
    } else {
      if (this.applications.length == 0) {
        return true;
      } else {
        return false;
      }
    }
  }

}
