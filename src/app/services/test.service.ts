import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TestModel } from 'src/app/models/testmodel';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private firestore: AngularFirestore) { }

  getTests() {
    return this.firestore.collection('tests').snapshotChanges();
  }
  createTest(testmodel: TestModel) {
    return this.firestore.collection('tests').add(testmodel);
  }
  updateTest(testmodel: TestModel) {
    return this.firestore.collection('tests').doc(testmodel.id).set(testmodel);
  }
  deleteTest(testmodel: TestModel) {
    return this.firestore.collection('tests').doc(testmodel.id).delete();
  }
}
