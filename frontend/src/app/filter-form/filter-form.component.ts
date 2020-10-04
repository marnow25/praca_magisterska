import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FileService } from '../shared/file.service'

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.css']
})
export class FilterFormComponent implements OnInit {

  filterFormGroup: FormGroup

  @Input()
  videosCaption;

  constructor(private _formBuilder: FormBuilder, private fileService: FileService) {
  }

  ngOnInit() {
    this.filterFormGroup = this._formBuilder.group({
      displayLabel: ['', Validators.required],
      tagsControl: [this.getTagsFromLocalStorage()],
      startDateControl: [this.getStartDateFromLocalStorage()],
      endDateControl: [this.getEndDateFromLocalStorage()],
      notification: this._formBuilder.group({
        tagsControl: [this.getTagsFromLocalStorage()],
        startDateControl: [this.getStartDateFromLocalStorage()],
        endDateControl: [this.getEndDateFromLocalStorage()]
      }, { validators: this.atLeastOneValidator }),
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
    this.saveToLocalStorage(filterValues)
    this.sendData(filterValues)
  }

  revert() {
    this.deleteLocalStorage()
    this.filterFormGroup.reset()
    this.fileService.showAllVideosList()
  }

  saveToLocalStorage(filterValues) {
    let tags = filterValues.tagsControl
    let startDate = filterValues.startDateControl
    let endDate = filterValues.endDateControl
    if (typeof tags !== 'undefined' && tags) {
      window.localStorage.setItem('tags' + this.videosCaption, tags)
    }
    if (typeof startDate !== 'undefined' && startDate) {
      window.localStorage.setItem('startDate' + this.videosCaption, startDate)
    }
    if (typeof endDate !== 'undefined' && endDate) {
      window.localStorage.setItem('endDate' + this.videosCaption, endDate)
    }
  }

  getTagsFromLocalStorage() {
    if (window.localStorage.getItem('tags' + this.videosCaption) !== null) {
      return window.localStorage.getItem('tags' + this.videosCaption)
    } else {
      return ''
    }
  }

  getStartDateFromLocalStorage() {
    if (window.localStorage.getItem('startDate' + this.videosCaption) !== null) {
      return window.localStorage.getItem('startDate' + this.videosCaption)
    } else {
      return ''
    }
  }

  getEndDateFromLocalStorage() {
    if (window.localStorage.getItem('endDate' + this.videosCaption) !== null) {
      return window.localStorage.getItem('endDate' + this.videosCaption)
    } else {
      return ''
    }
  }

  deleteLocalStorage(){
    window.localStorage.removeItem('tags' + this.videosCaption)
    window.localStorage.removeItem('startDate' + this.videosCaption)
    window.localStorage.removeItem('endDate' + this.videosCaption)
  }

  sendData(filterValues) {
    const fakeStartDate = new Date("September 14, 1900 12:00:00").toISOString()
    const fakeEndDate = new Date("September 14, 2100 12:00:00").toISOString()
    let tags = filterValues.tagsControl
    let startDate = filterValues.startDateControl
    let endDate = filterValues.endDateControl
    if (typeof tags !== 'undefined' && tags) {
      tags = tags.split(' ')
      if (typeof startDate !== 'undefined' && startDate && typeof endDate !== 'undefined' && endDate) {
        startDate = startDate.toISOString()
        endDate = endDate.toISOString()
        this.fileService.filterVideosList(this.videosCaption, tags, startDate, endDate)
      } else if (typeof startDate !== 'undefined' && startDate) {
        startDate = startDate.toISOString()
        this.fileService.filterVideosList(this.videosCaption, tags, startDate, fakeEndDate)
      } else if (typeof endDate !== 'undefined' && endDate) {
        endDate = endDate.toISOString()
        this.fileService.filterVideosList(this.videosCaption, tags, fakeStartDate, endDate)
      } else {
        this.fileService.filterVideosList(this.videosCaption, tags)
      }
    } else if (typeof startDate !== 'undefined' && startDate && typeof endDate !== 'undefined' && endDate) {
      startDate = startDate.toISOString()
      endDate = endDate.toISOString()
      this.fileService.filterVideosList(this.videosCaption, tags, startDate, endDate)
    } else if (typeof startDate !== 'undefined' && startDate) {
      startDate = startDate.toISOString()
      this.fileService.filterVideosList(this.videosCaption, tags, startDate, fakeEndDate)
    } else if (typeof endDate !== 'undefined' && endDate) {
      endDate = endDate.toISOString()
      this.fileService.filterVideosList(this.videosCaption, tags, fakeStartDate, endDate)
    } else {
      console.log("ERROR!")
    }
  }

}
