import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserLecturer } from '../models/userLecturer';

@Injectable()
export class AuthService {

  config = {
    apiKey: "AIzaSyDrjSMnM3sXuMq8t3urJ9Ta__H8z6Q5xuI",
    authDomain: "tutora-yxting.firebaseapp.com",
    databaseURL: "https://tutora-yxting.firebaseio.com",
    projectId: "tutora-yxting",
    storageBucket: "tutora-yxting.appspot.com",
    messagingSenderId: "949649593808",
    appId: "1:949649593808:web:942539b936d3f0a0"
  };
  secondaryApp = firebase.initializeApp(this.config, "Secondary");

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private fbSrv: FirebaseService, private snackBar: MatSnackBar) {
  }

  registerTutor(email: string, name: string, password: string, type: string) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(
        res => {
          this.snackBar.open(email + ' successfully registered as ' + type + '.', '', {
            verticalPosition: 'top',
            panelClass: 'snackbar-green',
            duration: 2500
          });
          this.fbSrv.register(email, name, type);
          this.setCurrentUser(email);
          resolve(res);
        }, err => {
          this.displayError(err);
          reject(err);
        }
      )
    });
  }

  registerLecturer(email: string, name: string, password: string, type: string, admin: string, courses: string[]) {
    return new Promise<any>((resolve, reject) => {
      this.secondaryApp.auth().createUserWithEmailAndPassword(email, password).then(
        res => {
          this.snackBar.open(email + ' successfully registered as ' + type + '.', '', {
            verticalPosition: 'top',
            panelClass: 'snackbar-green',
            duration: 2500
          });
          this.fbSrv.register(email, name, type);
          this.fbSrv.createLecturerProfile(email, name, admin, courses);
          this.secondaryApp.auth().signOut();
          resolve(res);
        }, err => {
          this.displayError(err);
          reject(err);
        }
      )
    });
  }

  displayError(err: any) {
    var error: string;
    switch (err.code) {
      case "auth/email-already-in-use":
        error = "Email already registered, please sign in or enter a different email.";
        break;
      case "auth/invalid-email":
        error = "Invalid email. Please enter a valid email address."
        break;
      case "auth/weak-password":
        error = "Password must be at least 6 characters."
        break;
      default:
        error = "Unknown error. Please contact support."
        break;
    }
    this.snackBar.open(error, '', {
      verticalPosition: 'top',
      panelClass: 'snackbar-red',
      duration: 2500
    });
  }

  login(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(res => {
          this.setCurrentUser(email);
          resolve(res);
        }, err => reject(err))
    })
  }

  logout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        resolve();
      }
      else {
        reject();
      }
    });
  }

  currentUser: BehaviorSubject<User> = new BehaviorSubject<User>({
    email: "",
    name: "",
    type: ""
  });
  setCurrentUser(email: string) {
    this.afs.collection('users', ref => ref.where('email', '==', email)).snapshotChanges().subscribe(
      response => {
        this.currentUser.next(response[0].payload.doc.data() as User);
      }
    );
  }
  getCurrentUser() {
    return this.currentUser;
  }

  currentLecturer: BehaviorSubject<UserLecturer> = new BehaviorSubject<UserLecturer>({
    email: "",
    name: "",
    admin: "",
    courseLinks: []
  });
  setCurrentLecturer(email: string) {
    this.afs.collection('usersLecturers', ref => ref.where('email', '==', email)).snapshotChanges().subscribe(
      response => {
        this.currentLecturer.next(response[0].payload.doc.data() as UserLecturer);
      }
    )
  }
  getCurrentLecturer() {
    return this.currentLecturer;
  }
}
