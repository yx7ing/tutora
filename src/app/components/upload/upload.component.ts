import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'
import { AngularFirestore } from '@angular/fire/firestore';
import { UploadDetailsService } from 'src/app/services/upload-details.service';
import { Upload } from 'src/app/models/upload';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

  @Input() uploadType: string;

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Observable<string>;
  isHovering: boolean;

  showDropzone = true;
  fileName: string;
  stringyDownloadURL: string = ''

  constructor(private storage: AngularFireStorage, private udSrv: UploadDetailsService) { }

  ngOnInit() {
  }

  
  toggleHover(event: boolean) {
    this.isHovering = event;
  }


  startUpload(event: FileList) {
    const file = event.item(0)
    if (file.type.split('/')[0] !== 'image') { 
      console.error('unsupported file type :( ')
      return;
    }
    const path = `documents/${new Date().getTime()}_${file.name}`;
    const customMetadata = { app: 'tutora' };
    this.task = this.storage.upload(path, file, { customMetadata })
    
    this.showDropzone = false;
    this.fileName = file.name;
    this.udSrv.newActiveUpload();

    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges()
    this.snapshot.pipe(
      finalize(
        () => {
          this.downloadURL = this.storage.ref(path).getDownloadURL();
          this.storage.ref(path).getDownloadURL().subscribe(
            results => {
              this.stringyDownloadURL = results;
              var upload: Upload = {
                type: this.uploadType,
                fileName: this.fileName,
                downloadUrl: this.stringyDownloadURL
              }
              this.udSrv.addUpload(upload);
              this.udSrv.completeActiveUpload();
            }
          )
        }
      )
    ).subscribe();
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  }

}