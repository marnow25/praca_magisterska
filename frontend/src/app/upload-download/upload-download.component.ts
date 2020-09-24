import { Component, OnInit } from '@angular/core';
import { FileService } from '../shared/file.service'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-download',
  templateUrl: './upload-download.component.html',
  styleUrls: ['./upload-download.component.css']
})
export class UploadDownloadComponent implements OnInit {

  uploadFormGroup: FormGroup
  uploadForm: FormGroup;
  uploadFailAlert = false
  uploadSuccessAlert = false
  fileSizeAlert = false

  constructor(private fileService: FileService, private formBuilder: FormBuilder, private httpClient: HttpClient) { 
    this.fileService.uploadSuccessFlagSubject.subscribe(data => {
      this.uploadSuccessAlert = data
    })
    this.fileService.uploadFailFlagSubject.subscribe(data => {
      this.uploadFailAlert = data
    })
  }

  filterResults: any

  ngOnInit() {
    this.uploadFormGroup = this.formBuilder.group({
      profile: ['', Validators.required],
      captionControl: ['', Validators.required],
      tagsControl: ['', Validators.required],
      cameraControl: ['', Validators.required],
      startDateControl: ['', Validators.required]
    })
  }

  onFileSelect(event) {
    if (event.target.files.length > 0 ) {
      if (event.target.files[0].size <= 10485760) {
        this.fileSizeAlert = false
        const file = event.target.files[0];
        this.uploadFormGroup.get('profile').setValue(file);
      } else {
        this.fileSizeAlert = true
      }
    }
  }

  onSubmit() {
    if (this.uploadFormGroup.get('profile').value && this.uploadFormGroup.get('captionControl').value && this.uploadFormGroup.get('cameraControl').value && this.uploadFormGroup.get('startDateControl')) {
      this.fileService.updateUploadFailFlagSubject(false);
      const formData = new FormData();
      const file = this.uploadFormGroup.get('profile').value
      console.log(file)
      formData.append('caption', this.uploadFormGroup.get('captionControl').value)
      let tmpArray = this.uploadFormGroup.get('tagsControl').value
      tmpArray = tmpArray.split(' ')
      formData.append('tags', tmpArray)
      formData.append('camera', this.uploadFormGroup.get('cameraControl').value)
      let date = this.uploadFormGroup.get('startDateControl').value
      date = new Date(date).toISOString()
      formData.append('date', date)
      formData.append('file', file);
      this.fileService.uploadFile(formData)
      setTimeout(() => {}, 1000)
    } else {
      this.fileService.updateUploadFailFlagSubject(true);
      this.fileService.updateUploadSuccessFlagSubject(false);
     }
  }

}
