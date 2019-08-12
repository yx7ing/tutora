import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserLecturer } from 'src/app/models/userLecturer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassUtilService } from 'src/app/services/class-util.service';
import { CourseLink } from 'src/app/models/courseLink';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css']
})
export class AdminEditComponent implements OnInit {

  editStep = 2;
  lecturer: UserLecturer;

  courseChecksRemove = [];
  removeCourses = [];

  term = "";

  courses = [];
  courseChecks = [];
  selectedCourses = [];

  searchState = ""

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar, private cuSrv: ClassUtilService, private fbSrv: FirebaseService) {
    this.lecturer = this.data.lecturer;
    this.courseChecksRemove = new Array(this.lecturer.courseLinks.length).fill(false);
  }

  ngOnInit() {
  }

  searchCourses(faculty: string) {
    this.cuSrv.searchCourses(faculty, this.term).subscribe(
      response => {
        this.courses = response;
        this.courseChecks = new Array(this.courses.length).fill(false);
        console.log(this.courseChecks)
      }
    )

    this.cuSrv.getSearchState().subscribe(
      response => {
        this.searchState = response;
      }
    )
  }

  submitStep2() {
    var removeCourses = [];
    for (let i in this.courseChecksRemove) {
      if (this.courseChecksRemove[i]) {
        removeCourses.push(this.lecturer.courseLinks[i])
      }
    }
    this.removeCourses = removeCourses;
    this.editStep = 3;
  }

  submitStep3() {
    var selectedCourses = [];
    for (let i in this.courseChecks) {
      if (this.courseChecks[i]) {
        selectedCourses.push(this.courses[i]);
      }
    }
    this.selectedCourses = selectedCourses;
    this.editStep = 4;
  }

  updateLecturer() {
    var newCourses = []
    for (let i in this.courseChecksRemove) {
      if (!this.courseChecksRemove[i]) {
        newCourses.push(this.lecturer.courseLinks[i]);
      }
    }
    for (let course of this.selectedCourses) {
      var courseCode = course.match(/[A-Z]{4}.*?\s/)[0];
      courseCode = courseCode.substr(0, courseCode.length-1);
      var courseName = course.match(/\s.*/)[0];
      courseName = courseName.substr(1, courseName.length)
      var courseLink: CourseLink = {
        course: courseCode,
        courseName: courseName,
        notification: false
      }
      newCourses.push(courseLink);
    }
    this.fbSrv.updateLecturer(this.lecturer, newCourses);
  }

}
