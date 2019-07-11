import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassUtilService } from 'src/app/services/class-util.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-admin-create-lecturer',
  templateUrl: './admin-create-lecturer.component.html',
  styleUrls: ['./admin-create-lecturer.component.css']
})
export class AdminCreateLecturerComponent implements OnInit {

  createStep = 1;
  name: string;
  nameStatus = true;
  email: string;
  emailStatus = true;
  password: string;
  passwordStatus = true;

  term = "";

  courses = [];
  courseChecks = [];
  selectedCourses = [];

  constructor(private snackBar: MatSnackBar, private cuSrv: ClassUtilService, private authSrv: AuthService) { }

  ngOnInit() {
  }

  submitStep1(name: string, email: string, password: string) {
    this.nameStatus = true;
    this.emailStatus = true;
    this.passwordStatus = true;
    var errorString = "Please enter a ";
    if (name == "" || name.match(/^\s*$/)) {
      this.nameStatus = false;
      errorString += "valid name, "
    }
    if (email == "" || !email.match(/.+@.+\..+/)) {
      this.emailStatus = false;
      if (!this.nameStatus && !(password == "" || password.length < 6)) {
        errorString += "and email, ";
      } else {
        errorString += "valid email, "
      }
    }
    if (password == "" || password.length < 6) {
      this.passwordStatus = false;
      if (!this.nameStatus || !this.emailStatus) {
        errorString += "and a password of at least 6 characters, "
      } else {
        errorString += "password of at least 6 characters, "
      }
    }
    errorString = errorString.substr(0, errorString.length - 2);
    errorString += "."
    if (this.nameStatus && this.emailStatus && this.passwordStatus) {
      this.name = name;
      this.email = email;
      this.password = password;
      this.createStep++;
    } else {
      this.snackBar.open(errorString, '', {
        verticalPosition: 'top',
        panelClass: 'snackbar-red',
        duration: 3000
      })
    }
    console.log(name, email, password);
  }

  searchCourses(faculty: string) {
    this.cuSrv.searchCourses(faculty, this.term).subscribe(
      response => {
        this.courses = response;
        this.courseChecks = new Array(this.courses.length).fill(false);
        console.log(this.courseChecks)
      }
    )
  }

  setSelectedCourses() {
    var selectedCourses = [];
    for (let i in this.courseChecks) {
      if (this.courseChecks[i]) {
        selectedCourses.push(this.courses[i]);
      }
    }
    this.selectedCourses = selectedCourses;
  }
  
  step3() {
    this.setSelectedCourses();
    this.createStep = 3;
  }

  createLecturer() {
    this.authSrv.register(this.email, this.password, 'lecturer', this.selectedCourses);
  }

}
