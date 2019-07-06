import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private afs: AngularFirestore) { }

  login(username:string, password: string){
    console.log("login")
    return this.afs.collection('accounts', ref => ref
    .where('username', '==', username)
    .where('password', '==', password)).snapshotChanges();
  }
}
