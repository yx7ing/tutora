import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { CourseLink } from 'src/app/models/courseLink';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-lecturer-home',
  templateUrl: './lecturer-home.component.html',
  styleUrls: ['./lecturer-home.component.css']
})
export class LecturerHomeComponent implements OnInit {

  constructor(private authSrv: AuthService, private router: Router, private fbSrv: FirebaseService) { }

  courses: CourseLink[] = [];

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        this.fbSrv.getLinkedCourses(response.email).subscribe(
          response => {
            for (let item of response) {
              this.courses.push(item.payload.doc.data() as CourseLink);
            }
            console.log(this.courses);
          }
        )
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



}
