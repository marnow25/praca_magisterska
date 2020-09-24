import { Component, OnInit } from '@angular/core';
import { FileService } from '../shared/file.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-timelines-container',
  templateUrl: './timelines-container.component.html',
  styleUrls: ['./timelines-container.component.css']
})
export class TimelinesContainerComponent implements OnInit {

  videosArray;
  captionsArray = []
  timelineVideosDividedArray;
  searchForm;
  public formError: boolean = false;

  constructor(private fileService: FileService, private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      videoGroupSearchId: ['']
    });
  }


  ngOnInit() {
    this.fileService.showAllVideosList()
    this.fileService.downloadAllVideos()
    this.fileService.allVideosList.subscribe(data => {
      this.videosArray = data
      this.captionsArray = this.populateCaptionsArray(this.videosArray)
      this.timelineVideosDividedArray = this.divideVideosByCaption(this.captionsArray, this.videosArray)
    })
  }

  populateCaptionsArray(videosArray) {
    let captionsList;
    for (let key in videosArray) {
      if (videosArray[key].captionsList) {
        captionsList = videosArray[key].captionsList
      }
    }
    return captionsList
  }

  divideVideosByCaption(captionsArray, videosArray) {
    let resultArray = []
    let videosArrayTmp = videosArray
    for (let capKey in captionsArray) {
      let tmpArray = []
      for (let vidKey in videosArrayTmp) {
        if (videosArrayTmp[vidKey].caption === captionsArray[capKey])
          tmpArray.push(videosArrayTmp[vidKey])
      }
      resultArray.push(tmpArray)
    }
    return resultArray
  }

  onSubmit(form) {
    const searchValue = form.value.videoGroupSearchId
    const buttonId = 'btn_' + searchValue
    if (document.getElementById(buttonId)) {
      document.getElementById(buttonId).scrollIntoView()
      this.formError = false
    } else {
      this.formError = true
    }
  }


}
