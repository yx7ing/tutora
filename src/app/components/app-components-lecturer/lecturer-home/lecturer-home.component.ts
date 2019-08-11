import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UserLecturer } from 'src/app/models/userLecturer';
import { MatTableDataSource } from '@angular/material/table';
import { CourseLink } from 'src/app/models/courseLink';

@Component({
  selector: 'app-lecturer-home',
  templateUrl: './lecturer-home.component.html',
  styleUrls: ['./lecturer-home.component.css']
})
export class LecturerHomeComponent implements OnInit {

  constructor(private authSrv: AuthService, private router: Router, private fbSrv: FirebaseService) { }

  lecturer: UserLecturer = {
    email: "",
    name: "",
    admin: "",
    courseLinks: []
  };
  courses: any[];
  displayedColumns: string[] = ['course', 'name', 'vacancies', 'notification'];
  dataSource;

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        if (response) {
          if (response.email) {
            this.authSrv.setCurrentLecturer(response.email);
          }
        }
      }
    )

    this.authSrv.getCurrentLecturer().subscribe(
      response => {
        this.lecturer = response;
        this.courses = this.lecturer.courseLinks;
        for (let i = 0; i < this.courses.length; i++) {
          console.log(this.courses[i])
          if (this.courses[i].length) {
            this.fbSrv.linkVacancyToCourseLink(this.courses[i][0].course).subscribe(
              response => {
                if (this.courses[i].length) {
                  this.courses[i][1] = response;
                } else {
                  this.courses[i] = [
                    this.courses[i],
                    response
                  ];
                }
              }
            );
          } else {
            this.fbSrv.linkVacancyToCourseLink(this.courses[i].course).subscribe(
              response => {
                if (this.courses[i].length) {
                  this.courses[i][1] = response;
                } else {
                  this.courses[i] = [
                    this.courses[i],
                    response
                  ];
                }
              }
            );
          }
        }
        console.log(this.courses);
        this.dataSource = new MatTableDataSource(this.courses);
      }
    )
  }
  
  selectCourse(course: CourseLink) {
    this.fbSrv.seeNotification(this.lecturer.email, course.course);
    this.router.navigate(['/crelture/course'], {state: {course: course}});
  }

}
