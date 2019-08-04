import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClassUtilService } from 'src/app/services/class-util.service';
import { ClassModel } from 'src/app/models/classModel';
import { Vacancy } from 'src/app/models/vacancy';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CourseLink } from 'src/app/models/courseLink';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/core/auth.service';
import { Application } from 'src/app/models/application';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { LecturerCourseApplicationComponent } from 'src/app/components/app-components-lecturer/lecturer-course-application/lecturer-course-application.component';

@Component({
  selector: 'app-lecturer-course',
  templateUrl: './lecturer-course.component.html',
  styleUrls: ['./lecturer-course.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LecturerCourseComponent implements OnInit {

  @Input() course: CourseLink;
  currentUser: User;
  vacancy: Vacancy = null;
  classes: ClassModel[] = [];
  applications: Application[] = [];
  applicationsPending: Application[] = [];
  applicationsAccepted: Application[] = [];
  applicationsShortlisted: Application[] = [];
  applicationsRejected: Application[] = [];

  displayedColumns: string[] = ['name', 'email', 'mark', 'tutExp', 'courseExp'];
  dataSourcePending;
  dataSourceAccepted;
  dataSourceShortlisted;
  dataSourceRejected;

  @ViewChild("sortPending", {static: true}) sortPending: MatSort;

  constructor(
    private router: Router, 
    private cuSrv: ClassUtilService, 
    private fbSrv: FirebaseService, 
    private authSrv: AuthService,
    private dialog: MatDialog) {
    if (this.router.getCurrentNavigation()) {
      this.course = this.router.getCurrentNavigation().extras.state.course;
      this.cuSrv.searchClasses(this.course.course);
      this.fbSrv.searchLecturerVacancy(this.course.course);
    } else {
      this.router.navigate(['/crelture/home'])
    }
  }

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        this.currentUser = response;
      }
    );

    this.cuSrv.searchClasses(this.course.course).subscribe(
      response => {
        this.classes = response;
      }
    );

    this.fbSrv.getLecturerVacancy().subscribe(
      response => {
        this.vacancy = response;
      }
    );

    this.fbSrv.searchApplicationsByCourse(this.course.course);
    this.fbSrv.getApplicationsByCourse().subscribe(
      response => {
        this.applications = response;
        this.applicationsPending = [];
        this.applicationsAccepted = [];
        this.applicationsShortlisted = [];
        this.applicationsRejected = [];
        for (let application of response) {
          switch(application.status){
            case "pending":
              this.applicationsPending.push(application);
              break;
            case "accepted":
              this.applicationsAccepted.push(application);
              break;
            case "shortlisted":
              this.applicationsShortlisted.push(application);
              break;
            case "rejected":
              this.applicationsRejected.push(application);
              break;
          }
        }
        this.dataSourcePending = new MatTableDataSource(this.applicationsPending);
        this.dataSourcePending.sort = this.sortPending;
        this.dataSourceAccepted = new MatTableDataSource(this.applicationsAccepted);
        this.dataSourceShortlisted = new MatTableDataSource(this.applicationsShortlisted);
        this.dataSourceRejected = new MatTableDataSource(this.applicationsRejected);
      }
    )
  }

  createVacancy(vacancies: number) {
    var vacancy: Vacancy = {
      lecturerEmail: this.currentUser.email,
      lecturerName: this.currentUser.name,
      course: this.course.course,
      courseName: this.course.courseName,
      vacancies: vacancies,
      filled: 0,
      active: true
    }
    this.fbSrv.createVacancy(vacancy);
  }

  selectCourse(application: Application) {
    this.dialog.open(LecturerCourseApplicationComponent, {
      data: {
        "application": application
      }
    });
  }

}
