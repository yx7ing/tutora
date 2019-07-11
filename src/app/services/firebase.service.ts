import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user';
import { CourseLink } from '../models/courseLink';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private afs: AngularFirestore) { }

  register(email: string, type: string) {
    var user: User = {
      email: email,
      type: type
    }
    this.afs.collection('users').add(user);
  }

  linkCourses(email: string, courses: string[]) {
    for (let course of courses) {
      var courseCode = course.match(/[A-Z]{4}.*?\s/)[0];
      courseCode = courseCode.substr(0, courseCode.length-1);
      var courseName = course.match(/\s.*/)[0];
      courseName = courseName.substr(1, courseName.length)
      var courseLink: CourseLink = {
        email: email,
        course: courseCode,
        courseName: courseName
      }
      this.afs.collection('courseLinks').add(courseLink);
    }
  }

  getLinkedCourses(email: string) {
    console.log('finding courses')
    return this.afs.collection('courseLinks', ref => ref
    .where('email', '==', email)).snapshotChanges();
  }
}
