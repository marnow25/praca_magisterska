import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FileService } from '../shared/file.service'
import { UserService } from '../shared/user.service'

@Component({
  selector: 'app-filter-matrix',
  templateUrl: './filter-matrix.component.html',
  styleUrls: ['./filter-matrix.component.css']
})
export class FilterMatrixComponent implements OnInit {

  filterFormGroup: FormGroup
  filterMatrixData
  filterMatrixDataCopy
  foundItemsAlert = false
  notFoundItemsAlert = true
  numberOfItemsFound = 0

  constructor(private _formBuilder: FormBuilder, private fileService: FileService, private userService: UserService) {
  }

  ngOnInit() {
    this.filterFormGroup = this._formBuilder.group({
      displayLabel: ['', Validators.required],
      captionControl: [''],
      tagsControl: [''],
      startDateControl: [''],
      endDateControl: [''],
      notification: this._formBuilder.group({
        captionControl: [''],
        tagsControl: [''],
        startDateControl: [''],
        endDateControl: ['']
      }, { validators: this.atLeastOneValidator }),
    })
    this.fileService.matrixFilterListSubject.subscribe((data) => {
      this.filterMatrixData = data
      console.log(this.filterMatrixData)
      if (this.filterMatrixData.length !== 0) {
        this.markMatchingVideos()
      } else {
        this.eraseMarkMatchingVideos(this.filterMatrixDataCopy)
      }
    })
  }

  public atLeastOneValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    let controls = control.controls;
    if (controls) {
      let theOne = Object.keys(controls).findIndex(key =>
        controls[key].value !== '' && controls[key].value !== null
      );
      if (theOne === -1) {
        return {
          atLeastOneRequired: {
            text: 'At least one field is required.'
          }
        }
      }
    };

  }

  onSubmit(form) {
    const filterValues = form.value.notification
    this.sendData(filterValues)
  }

  revert() {
    this.filterFormGroup.reset()
    this.fileService.updateMatrixFilterListSubject([])
    this.filterMatrixData = null
    this.filterMatrixDataCopy = null
  }

  sendData(filterValues) {
    let caption = filterValues.captionControl
    let tags = filterValues.tagsControl
    let startDate = filterValues.startDateControl
    let endDate = filterValues.endDateControl
    if (typeof tags !== 'undefined' && tags) {
      tags = tags
    } else {
      const fakeTags = ['fakeTags']
      tags = fakeTags
    }
    if (typeof caption !== 'undefined' && caption) {
      caption = caption
    } else {
      const fakeCaption = 'fakeCaption'
      caption = fakeCaption
    }
    if (typeof startDate !== 'undefined' && startDate) {
      startDate = startDate.toISOString()
    } else {
      const fakeStartDate = new Date("September 14, 1900 12:00:00").toISOString()
      startDate = fakeStartDate
    }
    if (typeof endDate !== 'undefined' && endDate) {
      endDate = endDate.toISOString()
    } else {
      const fakeEndDate = new Date("September 14, 2100 12:00:00").toISOString()
      endDate = fakeEndDate
    }
    this.fileService.filterMatrixVideosList(caption, tags, startDate, endDate)
  }

  markMatchingVideos() {
    if (this.filterMatrixDataCopy) {
      this.eraseMarkMatchingVideos(this.filterMatrixDataCopy)
      for (let key in this.filterMatrixData) {
        const htmlIndex = "rectange-caption-" + this.filterMatrixData[key].caption + "-file-" + this.filterMatrixData[key].fileName
        document.getElementById(htmlIndex).style.setProperty('background', '#FF7F50');
        document.getElementById(htmlIndex).style.setProperty('border', '2px solid #FF4500');
      }
    } else {
      for (let key in this.filterMatrixData) {
        const htmlIndex = "rectange-caption-" + this.filterMatrixData[key].caption + "-file-" + this.filterMatrixData[key].fileName
        document.getElementById(htmlIndex).style.setProperty('background', '#FF7F50');
        document.getElementById(htmlIndex).style.setProperty('border', '2px solid #FF4500');
      }
    }
    this.filterMatrixDataCopy = this.filterMatrixData
    this.foundItemsAlert = true
    this.notFoundItemsAlert = false
    this.numberOfItemsFound = this.filterMatrixData.length
  }
  eraseMarkMatchingVideos(filterMatrixDataCopy) {
    for (let key in filterMatrixDataCopy) {
      const htmlIndex = "rectange-caption-" + filterMatrixDataCopy[key].caption + "-file-" + filterMatrixDataCopy[key].fileName
      document.getElementById(htmlIndex).style.setProperty('background', 'grey');
      document.getElementById(htmlIndex).style.setProperty('border', '2px solid rgb(155, 155, 155)');
    }
    this.foundItemsAlert = false
    this.notFoundItemsAlert = true
  }
}