import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user';
import { UserTutor } from 'src/app/models/userTutor';

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

  constructor(
    private authSrv: AuthService,
    private fbSrv: FirebaseService
  ) 
  {}

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        if (response) {
          this.currentUser = response;
          this.fbSrv.searchTutor(response.email);
        }
        console.log(this.currentUser);
      }
    );

    this.fbSrv.getTutor().subscribe(
      response => {
        this.currentTutor = response;
        console.log(response);
      }
    )
  }

}
