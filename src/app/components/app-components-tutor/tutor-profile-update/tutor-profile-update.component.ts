import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/models/user';
import { UserTutor } from 'src/app/models/userTutor';
import { Router } from '@angular/router';
import { TutorExperience } from 'src/app/models/tutorExperience';
import { UploadDetailsService } from 'src/app/services/upload-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Upload } from 'src/app/models/upload';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-tutor-profile-update',
  templateUrl: './tutor-profile-update.component.html',
  styleUrls: ['./tutor-profile-update.component.css']
})
export class TutorProfileUpdateComponent implements OnInit {

  user: User = {
    email: "",
    name: "",
    type: ""
  };
  tutor: UserTutor = {
    email: "",
    name: "",
    dob: "",
    mobile: "",
    address: "",
    degree: "",
    yoc: "",
    uoc: "",
    wam: "",
    cv: null,
    tutorExperience: []
  };
  cv: Upload = null;
  tutExps: TutorExperience[] = [];

  constructor(
    private authSrv: AuthService, 
    private router: Router, 
    private udSrv: UploadDetailsService, 
    private snackBar: MatSnackBar,
    private fbSrv: FirebaseService
  ) { 
    if (this.router.getCurrentNavigation()) {
      this.user = this.router.getCurrentNavigation().extras.state.user;
      console.log(this.user)
      this.tutor = this.router.getCurrentNavigation().extras.state.tutor;
    }
  }

  ngOnInit() {
  }

  updateProfile(pw: string, dob: string, mob: string, add: string, deg: string, yoc: string, uoc: string, wam: string) {
    console.log(pw, dob, mob, add, deg, yoc, uoc, wam)
    if (pw.length < 6) {
      this.snackBar.open('Please enter a password at least 6 characters long.', '', {
        verticalPosition: 'top',
        panelClass: 'snackbar-red',
        duration: 2500
      });
    } else if (dob == "" || mob == "" || add == "" || deg == "" || yoc == "" || uoc == "" || wam == "") {
      this.snackBar.open('Please fill all fields.', '', {
        verticalPosition: 'top',
        panelClass: 'snackbar-red',
        duration: 2500
      });
    }
    else {
      this.cv = this.udSrv.getCvUpload()
      for (var i = 0; i < this.tutExps.length; i++) {
        this.tutExps[i].document = this.udSrv.getMyExpUploads()[i]
      }
      for (let tutExp of this.tutExps) {
        if (tutExp.course == "" || tutExp.courseName == "" || tutExp.taught == "" || tutExp.lic == "" || !tutExp.document) {
          this.snackBar.open('Please fill all fields of each tutoring experience row, or remove unnecessary rows.', '', {
            verticalPosition: 'top',
            panelClass: 'snackbar-red',
            duration: 2500
          });
          return;
        }
      }
      var tutor: UserTutor = {
        email: this.user.email,
        name: this.user.name,
        dob: dob,
        mobile: mob,
        address: add,
        degree: deg,
        yoc: yoc,
        uoc: uoc,
        wam: wam,
        cv: this.cv,
        tutorExperience: this.tutExps
      }
      this.fbSrv.updateTutorProfile(tutor);
      this.authSrv.updatePassword(pw);
    }
  }

  addTutExp() {
    var tutExp: TutorExperience = {
      course: "",
      courseName: "",
      taught: "",
      lic: "",
      document: null
    }
    this.tutExps.push(tutExp);
  }
  removeRow(i: number){
    this.tutExps.splice(i, 1);
    this.udSrv.removeMyExpUpload(i);
  }

}
