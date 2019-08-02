import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassUtilService } from 'src/app/services/class-util.service';
import { ClassModel } from 'src/app/models/classModel';
import { Vacancy } from 'src/app/models/vacancy';
import { FirebaseApp } from '@angular/fire';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CourseLink } from 'src/app/models/courseLink';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/core/auth.service';

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

  constructor(private router: Router, private cuSrv: ClassUtilService, private fbSrv: FirebaseService, private authSrv: AuthService) {
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
    )

    this.cuSrv.searchClasses(this.course.course).subscribe(
      response => {
        console.log(response);
        this.classes = response;
      }
    )

    this.fbSrv.getLecturerVacancy().subscribe(
      response => {
        console.log(response);
        this.vacancy = response;
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
      filled: 0
    }
    this.fbSrv.createVacancy(vacancy);
  }

}
