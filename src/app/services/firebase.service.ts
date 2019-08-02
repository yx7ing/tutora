import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user';
import { CourseLink } from '../models/courseLink';
import { UserLecturer } from '../models/userLecturer';
import { BehaviorSubject } from 'rxjs';
import { UserTutor } from '../models/userTutor';
import { Vacancy } from '../models/vacancy';
import { Application } from '../models/application';

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

  tutor: BehaviorSubject<UserTutor> = new BehaviorSubject<UserTutor>({
    email: "", name: "", dob: "", mobile: "", address: "", degree: "",
    yoc: "", uoc: "", wam: "", cv: null, tutorExperience: []
  });
  searchTutor(email: string) {
    this.afs.collection('usersTutors', ref => ref
    .where('email', '==', email)).snapshotChanges().subscribe(
      response => {
        this.tutor.next(response[0].payload.doc.data() as UserTutor);
      }
    )
  }
  getTutor() {
    return this.tutor;
  }

  lecturerVacancy: BehaviorSubject<Vacancy> = new BehaviorSubject<Vacancy>(null);
  searchLecturerVacancy(course: string) {
    this.afs.collection('vacancies' , ref => ref
    .where('course', '==', course)).snapshotChanges().subscribe(
      response => {
        if (response.length > 0) {
          this.lecturerVacancy.next(response[0].payload.doc.data() as Vacancy);  
        } else {
          this.lecturerVacancy.next({
            lecturerEmail: "", lecturerName: "", course: "", courseName: "", vacancies: 0, filled: 0
          });
        }
      }
    )
  }
  getLecturerVacancy() {
    return this.lecturerVacancy;
  }
  createVacancy(vacancy: Vacancy) {
    this.afs.collection('vacancies').add(vacancy);
  }

  vacancies: BehaviorSubject<Vacancy[]> = new BehaviorSubject<Vacancy[]>(null);
  searchVacancies() {
    this.afs.collection('vacancies').snapshotChanges().subscribe(
      response => {
        if (response.length > 0) {
          var vacancies: Vacancy[] = [];
          for (let item of response) {
            vacancies.push(item.payload.doc.data() as Vacancy);
          }
          this.vacancies.next(vacancies);
        } else {
          this.vacancies.next([]);
        }
      }
    )
  }
  getVacancies() {
    return this.vacancies;
  }

  submitApplicationResponse: BehaviorSubject<string> = new BehaviorSubject<string>("")
  submitApplication(application: Application) {
    this.afs.collection('applications').add(application).then(
      res => {
        this.submitApplicationResponse.next("success");
        this.submitApplicationResponse.next("");
      }
    );
  }
  getSubmitApplicationResponse() {
    return this.submitApplicationResponse;
  }

  applications: BehaviorSubject<Application[]> = new BehaviorSubject<Application[]>([]);
  searchApplications(email: string) {
    this.afs.collection('appl')
  }

}
