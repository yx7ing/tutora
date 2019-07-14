import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user';
import { CourseLink } from '../models/courseLink';
import { UserLecturer } from '../models/userLecturer';
import { BehaviorSubject } from 'rxjs';
import { UserTutor } from '../models/userTutor';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private afs: AngularFirestore) { }

  register(email: string, name: string, type: string) {
    var user: User = {
      email: email,
      name: name,
      type: type
    }
    this.afs.collection('users').add(user);
  }

  createTutorProfile(tutor: UserTutor) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('usersTutors').add(tutor)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    });
  }

  createLecturerProfile(email: string, name: string, admin: string, courses: string[]) {
    var courseLinks: CourseLink[] = [];
    for (let course of courses) {
      var courseCode = course.match(/[A-Z]{4}.*?\s/)[0];
      courseCode = courseCode.substr(0, courseCode.length-1);
      var courseName = course.match(/\s.*/)[0];
      courseName = courseName.substr(1, courseName.length)
      var courseLink: CourseLink = {
        course: courseCode,
        courseName: courseName
      }
      courseLinks.push(courseLink);
    }
    var userLecturer: UserLecturer = {
      email: email,
      name: name,
      admin: admin,
      courseLinks: courseLinks
    }
    this.afs.collection('usersLecturers').add(userLecturer);
  }

  lecturers: BehaviorSubject<UserLecturer[]> = new BehaviorSubject<UserLecturer[]>([]);
  searchLecturers(email: string) {
    this.afs.collection('usersLecturers', ref => ref
    .where('admin', '==', email)).snapshotChanges().subscribe(
      response => {
        var lecturerDetails: UserLecturer[] = []
        for (let item of response) {
          var userLecturer: UserLecturer = item.payload.doc.data() as UserLecturer;
          lecturerDetails.push(userLecturer);
        }
        this.lecturers.next(lecturerDetails)
      }
    )
  }
  getLecturers() {
    return this.lecturers;
  }

}
