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
  displayedColumns: string[] = ['course', 'name'];
  dataSource;

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        this.authSrv.setCurrentLecturer(response.email);
      }
    )

    this.authSrv.getCurrentLecturer().subscribe(
      response => {
        this.lecturer = response;
        this.dataSource = new MatTableDataSource(this.lecturer.courseLinks);
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

  selectCourse(course: CourseLink) {
    this.router.navigate(['/crelture/course'], {state: {course: course.course}});
  }

}
