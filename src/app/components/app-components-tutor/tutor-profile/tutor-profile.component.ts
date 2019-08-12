import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user';
import { UserTutor } from 'src/app/models/userTutor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutor-profile',
  templateUrl: './tutor-profile.component.html',
  styleUrls: ['./tutor-profile.component.css']
})
export class TutorProfileComponent implements OnInit {

  currentUser: User = {
    email: "",
    name: "",
    type: ""
  }
  currentTutor: UserTutor = {
    email: "", name: "", dob: "", mobile: "", address: "", degree: "",
    yoc: "", uoc: "", wam: "", cv: null, tutorExperience: []
  };
  runOnce = 0;

  constructor(
    private authSrv: AuthService,
    private fbSrv: FirebaseService,
    private router: Router
  ) 
  {}

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        if (response) {
          this.currentUser = response;
          this.fbSrv.searchTutor(response.email);
        }
      }
    );

    this.fbSrv.getTutor().subscribe(
      response => {
        this.currentTutor = response;
        var cv = document.getElementById("downloadcv");
        if (this.currentTutor.cv) {
          cv.setAttribute("href", this.currentTutor.cv.downloadUrl);
        }
        if (this.currentTutor.tutorExperience.length > 0) {
          setInterval(this.increment.bind(this), 10);
        }
      }
    )
  }

  edit() {
    this.router.navigate(['/trout/profile-update'], {state: {
      user: this.currentUser,
      tutor: this.currentTutor
    }});
  }

  increment() {
    if (this.runOnce == 0) {
      var i = 0
      for (let tutExp of this.currentTutor.tutorExperience) {
        var id = "tutExpDoc" + i;
        var tutExpDoc = document.getElementById(id);
        if (!tutExpDoc) return;
        tutExpDoc.setAttribute("href", tutExp.document.downloadUrl);
        i++;
      }
      this.runOnce++;
    }
  }

}
