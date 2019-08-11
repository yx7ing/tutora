import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user';
import { CourseLink } from '../models/courseLink';
import { UserLecturer } from '../models/userLecturer';
import { BehaviorSubject } from 'rxjs';
import { UserTutor } from '../models/userTutor';
import { Vacancy } from '../models/vacancy';
import { Application } from '../models/application';
import { ClassUtilService } from './class-util.service';
import { ClassModel } from '../models/classModel';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private afs: AngularFirestore, private cuSrv: ClassUtilService) { }

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
        courseName: courseName,
        notification: false
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

    for (let course of courseLinks) {
      this.cuSrv.searchClasses(course.course).subscribe(
        response => {
          if (response.length > 0) {
            for (let item of response) {
              item.lecturer = email;
              item.lecturerName = name;
              this.afs.collection('classes').add(item);
            }
          }
        }
      )
    }
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
        if (response.length > 0) {
          this.tutor.next(response[0].payload.doc.data() as UserTutor);
        }
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
            lecturerEmail: "", lecturerName: "", course: "", courseName: "", vacancies: 0, filled: 0, active: false
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

  linkVacancyToCourseLink(course: string) {
    var vacancy: BehaviorSubject<Vacancy> = new BehaviorSubject<Vacancy>(null);
    this.afs.collection('vacancies' , ref => ref
    .where('course', '==', course)).snapshotChanges().subscribe(
      response => {
        if (response.length > 0) {
          vacancy.next(response[0].payload.doc.data() as Vacancy);
        } else {
          vacancy.next({
            lecturerEmail: "", lecturerName: "", course: "", courseName: "", vacancies: 0, filled: 0, active: false
          });
        }
      }
    )
    return vacancy;
  }

  submitApplicationResponse: BehaviorSubject<string> = new BehaviorSubject<string>("")
  submitApplication(application: Application) {
    this.afs.collection('applications').add(application).then(
      res => {
        this.submitApplicationResponse.next("success");
        this.submitApplicationResponse.next("");
        this.afs.collection('usersLecturers', ref => ref
        .where('email', '==', application.lecturer)).snapshotChanges().subscribe(
          response => {
            var lecturer = response[0].payload.doc.data() as UserLecturer;
            var courseLinks = lecturer.courseLinks;
            for (let courseLink of courseLinks) {
              if (courseLink.course == application.course) {
                courseLink.notification = true;
                this.afs.collection('usersLecturers').doc(response[0].payload.doc.id).update({'courseLinks': courseLinks})
              }
            }
          }
        )
      }
    );
  }
  getSubmitApplicationResponse() {
    return this.submitApplicationResponse;
  }

  applications: BehaviorSubject<Application[]> = new BehaviorSubject<Application[]>(null);
  searchApplications(email: string) {
    this.afs.collection('applications', ref => ref
    .where('email', '==', email)).snapshotChanges().subscribe(
      response => {
        var applications: Application[] = []
        for (let item of response) {
          applications.push(item.payload.doc.data() as Application);
        }
        this.applications.next(applications);
      }
    )
  }
  getApplications() {
    return this.applications;
  }

  applicationsByCourse: BehaviorSubject<Application[]> = new BehaviorSubject<Application[]>([]);
  searchApplicationsByCourse(course: string) {
    this.afs.collection('applications', ref => ref
    .where('course', '==', course)).snapshotChanges().subscribe(
      response => {
        var applications: Application[] = []
        for (let item of response) {
          applications.push(item.payload.doc.data() as Application);
        }
        this.applicationsByCourse.next(applications);
      }
    );
  }
  getApplicationsByCourse() {
    return this.applicationsByCourse;
  }

  application: BehaviorSubject<Application> = new BehaviorSubject<Application>(null);
  searchApplication(tutorEmail: string, course: string) {
    this.afs.collection('applications', ref => ref
    .where('course', '==', course)
    .where('email', '==', tutorEmail))
    .snapshotChanges().subscribe(
      response => {
        this.application.next(response[0].payload.doc.data() as Application)
      }
    );
  }
  getApplication() {
    return this.application;
  }

  seeNotification(email: string, course: string) {
    var runOnce = 0;
    this.afs.collection('usersLecturers', ref => ref
    .where('email', '==', email)).snapshotChanges().subscribe(
      response => {
        if (runOnce == 0) {
          var lecturer = response[0].payload.doc.data() as UserLecturer;
          var courseLinks = lecturer.courseLinks;
          for (let courseLink of courseLinks) {
            if (courseLink.course == course) {
              courseLink.notification = false;
              this.afs.collection('usersLecturers').doc(response[0].payload.doc.id).update({'courseLinks': courseLinks});
            }
          }
          runOnce++;
        }
      }  
    );
  }

  updateInterview(tutorEmail: string, course: string, update: string, lecturerName: string) {
    var runOnce = 0;
    this.afs.collection('applications', ref => ref
    .where('course', '==', course)
    .where('email', '==', tutorEmail))
    .snapshotChanges().subscribe(
      response => {
        if (runOnce == 0) {
          if (update == "pass" || update == "fail") {
            this.afs.collection('applications').doc(response[0].payload.doc.id).update({'interviewStatus': update});
            if (update == "pass") {
              this.notify(
                tutorEmail,
                "Congratulations! You have passed your interview with " + lecturerName + " for " + course + "."
              );
            }
            if (update == "fail") {
              this.notify(
                tutorEmail,
                "Unfortunately, you did not pass your interview with " + lecturerName + " for " + course + ". Don't give up! The right class for you is waiting out there."
              );
            }
          } else {
            this.afs.collection('applications').doc(response[0].payload.doc.id).update({'interview': update, 'interviewStatus': 'pending'});
            this.notify(
              tutorEmail,
              lecturerName + " has set your interview for " + update + "."
            );
          }
          runOnce++;
        }
      }
    );
  }

  updateApplicationStatus(tutorEmail: string, course: string, status: string) {
    var runOnce = 0;
    this.afs.collection('applications', ref => ref
    .where('course', '==', course)
    .where('email', '==', tutorEmail))
    .snapshotChanges().subscribe(
      response => {
        if (runOnce == 0) {
          this.afs.collection('applications').doc(response[0].payload.doc.id).update({'status': status});
          runOnce++;
        }
      }
    );
  }

  classes: BehaviorSubject<ClassModel[]> = new BehaviorSubject<ClassModel[]>([]);
  searchClasses(email: string, course: string) {
    this.afs.collection('classes', ref => ref
    .where('course', '==', course)
    .where('lecturer', '==', email))
    .snapshotChanges().subscribe(
      response => {
        var classes: ClassModel[] = [];
        for (let item of response) {
          classes.push(item.payload.doc.data() as ClassModel);
        }
        this.classes.next(classes);
      }
    );
  }
  getClasses() {
    return this.classes;
  }

  updateClass(_class: ClassModel, email: string, name: string, vacancy: Vacancy, currentTutor: string) {
    var runOnce = 0;
    this.afs.collection('classes', ref => ref
    .where('course', '==', _class.course)
    .where('id', '==', _class.id))
    .snapshotChanges().subscribe(
      response => {
        if (runOnce == 0) {
          this.afs.collection('classes').doc(response[0].payload.doc.id).update({'tutor': email, 'tutorName': name});
          runOnce++;
        }
      }
    );

    var runUpdateVacancyOnce = 0;
    if (email != "" && currentTutor != "") {
      // do nothing
    } else {
      this.afs.collection('vacancies', ref => ref
      .where('course', '==', vacancy.course))
      .snapshotChanges().subscribe(
        response => {
          if (runUpdateVacancyOnce == 0) {
            var _vacancy: Vacancy = response[0].payload.doc.data() as Vacancy;
            if (currentTutor == "") {
              this.afs.collection('vacancies').doc(response[0].payload.doc.id).update({'filled': _vacancy.filled+1});
            } else if (email == "") {
              this.afs.collection('vacancies').doc(response[0].payload.doc.id).update({'filled': _vacancy.filled-1});
            }
            runUpdateVacancyOnce++;
          }
        }
      );
    }
  }

  tutorClasses: BehaviorSubject<ClassModel[]> = new BehaviorSubject<ClassModel[]>(null);
  searchTutorClasses(email: string) {
    this.afs.collection('classes', ref => ref
    .where('tutor', '==', email))
    .snapshotChanges().subscribe(
      response => {
        var classes: ClassModel[] = [];
        for (let item of response) {
          classes.push(item.payload.doc.data() as ClassModel);
        }
        this.tutorClasses.next(classes);
      }
    );
  }
  getTutorClasses() {
    return this.tutorClasses;
  }

  notify(email: string, message: string) {
    var today = new Date();
    var timestamp = today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear().toString().substr(2)+" "+today.getHours()+":";
    if (today.getMinutes() < 10) {
      timestamp += "0";
    }
    timestamp += today.getMinutes()+":";
    if (today.getSeconds() < 10) {
      timestamp += "0";
    }
    timestamp += today.getSeconds();
    var notification: Notification = {
      email: email,
      message: message,
      timestamp: timestamp,
      seen: false
    }
    this.afs.collection('notifications').add(notification);
  }

  notifications: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  searchNotifications(email: string) {
    this.afs.collection('notifications', ref => ref
    .where('email', '==', email))
    .snapshotChanges().subscribe(
      response => {
        var notifications: any[] = [];
        for (let item of response) {
          var notification = {
            notification: item.payload.doc.data() as Notification,
            id : item.payload.doc.id
          }
          notifications.push(notification);
        }
        this.notifications.next(notifications);
      }
    );
  }
  getNotifications() {
    return this.notifications;
  }

  seeTutorNotifications(notifications: any[]) {
    for (let notification of notifications) {
      this.afs.collection('notifications').doc(notification.id).update({seen: true});
    }
    console.log('seen')
  }
}
