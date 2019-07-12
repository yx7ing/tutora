import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user';
import { CourseLink } from '../models/courseLink';
import { stringify } from 'querystring';
import { UserLecturer } from '../models/userLecturer';
import { BehaviorSubject } from 'rxjs';

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

  createLecturerProfile(email: string, admin: string, courses: string[]) {
    var userLecturer: UserLecturer = {
      email: email,
      admin: admin
    }
    this.afs.collection('usersLecturers').add(userLecturer);
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
    return this.afs.collection('courseLinks', ref => ref
    .where('email', '==', email)).snapshotChanges();
  }

  lecturers: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  searchLecturers(email: string) {
    var lecturers: any[] = [];
    this.afs.collection('usersLecturers', ref => ref
    .where('admin', '==', email)).snapshotChanges().subscribe(
      response => {
        for (let item of response) {
          var lecturerData: any[] = [];
          var userLecturer: UserLecturer = item.payload.doc.data() as UserLecturer;
          lecturerData.push(userLecturer.email);
          this.afs.collection('users', ref => ref
          .where('email', '==', userLecturer.email)).snapshotChanges().subscribe(
            response => {
              var user: User = response[0].payload.doc.data() as User;
              lecturerData.push(user.name);
              console.log(user);
              this.afs.collection('courseLinks', ref => ref
              .where('email', '==', userLecturer.email)).snapshotChanges().subscribe(
                response => {
                  for (let item of response) {
                    var courseLink: CourseLink = item.payload.doc.data() as CourseLink;
                    var courseLinkData: object = {
                      course: courseLink.course,
                      courseName: courseLink.courseName
                    }
                    lecturerData.push(courseLinkData);
                  }
                }
              );
            }
          );
          lecturers.push(lecturerData);
        }
        this.lecturers.next(lecturers);
      }
    );
  }
  getLecturers() {
    return this.lecturers;
  }

}
