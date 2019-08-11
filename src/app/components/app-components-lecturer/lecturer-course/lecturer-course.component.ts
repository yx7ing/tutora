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
import { LecturerCourseAssignComponent } from '../lecturer-course-assign/lecturer-course-assign.component';

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
  applications: Application[] = [];
  applicationsPending: Application[] = [];
  applicationsAccepted: Application[] = [];
  applicationsShortlisted: Application[] = [];
  applicationsRejected: Application[] = [];

  displayedColumns: string[] = ['name', 'email', 'mark', 'tutExp', 'courseExp', 'intTime', 'intStatus'];
  dataSourcePending;
  dataSourceAccepted;
  dataSourceShortlisted;
  dataSourceRejected;

  @ViewChild("sortPending", {static: true}) sortPending: MatSort;
  @ViewChild("sortAccepted", {static: true}) sortAccepted: MatSort;
  @ViewChild("sortShortlisted", {static: true}) sortShortlisted: MatSort;
  @ViewChild("sortRejected", {static: true}) sortRejected: MatSort;

  classes: ClassModel[] = [];
  classColumns: string[] = ['type', 'enrolments', 'details', 'tutor'];
  dataSourceClasses;
  @ViewChild("sortClasses", {static: true}) sortClasses: MatSort;

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
        if (this.course) {
          this.fbSrv.searchClasses(this.currentUser.email, this.course.course);
        }
      }
    );
    this.fbSrv.getClasses().subscribe(
      response => {
        this.classes = response;
        this.dataSourceClasses = new MatTableDataSource(this.classes);
      }
    )

    this.fbSrv.getLecturerVacancy().subscribe(
      response => {
        this.vacancy = response;
      }
    );

    if (this.course) {
      this.fbSrv.searchApplicationsByCourse(this.course.course);
    }
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
        this.dataSourceAccepted.sort = this.sortAccepted;
        this.dataSourceShortlisted = new MatTableDataSource(this.applicationsShortlisted);
        this.dataSourceShortlisted.sort = this.sortShortlisted;
        this.dataSourceRejected = new MatTableDataSource(this.applicationsRejected);
        this.dataSourceRejected.sort = this.sortRejected;
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

  selectApplication(application: Application) {
    this.dialog.open(LecturerCourseApplicationComponent, {
      data: {
        "application": application
      }
    });
  }

  checkVacancy() {
    if (this.vacancy) {
      if (this.vacancy.lecturerEmail == '') {
        return false;
      } else {
        return true;
      }
    }
  }

  selectClass(_class: ClassModel) {
    this.dialog.open(LecturerCourseAssignComponent, {
      data: {
        'class': _class,
        'acceptedTutors': this.applicationsAccepted,
        'vacancy': this.vacancy
      }
    })
  }

}
