import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FileService } from '../shared/file.service'
import { UserService } from '../shared/user.service'
import { FavouriteService } from '../shared/favourite.service';
import { FilterMatrixComponent } from '../filter-matrix/filter-matrix.component'

declare var $: any;

@Component({
  selector: 'app-matrix-list-container',
  templateUrl: './matrix-list-container.component.html',
  styleUrls: ['./matrix-list-container.component.css']
})
export class MatrixListContainerComponent implements OnInit {

  videosArray;
  captionsArray
  listVideosDividedArray
  userDetails
  login

  modalVideoCaption
  modalVideoFilename
  openVideoModal = false
  openDeleteModal = false
  @ViewChild(FilterMatrixComponent, {static: false}) private childFilterMatrixComponent: FilterMatrixComponent;
  

  constructor(private fileService: FileService, private userService: UserService, private changeDetectorRef: ChangeDetectorRef, private favouriteService: FavouriteService) { }

  ngOnInit() {
    this.fileService.showAllVideosList()
    this.fileService.downloadAllVideos()
    this.userService.getUserProfile().subscribe( data => {
      this.userDetails = data["user"]
      this.login = data["user"]["login"]
    })
    this.fileService.allVideosList.subscribe(data => {
      this.videosArray = data
      this.captionsArray = this.populateCaptionsArray(this.videosArray)
      this.listVideosDividedArray = this.divideVideosByCaption(this.captionsArray, this.videosArray)
      this.changeDetectorRef.detectChanges();
      console.log(this.captionsArray)
      console.log(this.listVideosDividedArray)
      console.log(this.videosArray)
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

  modalVideoPrepareData(videoData) {
    this.modalVideoCaption = videoData.caption
    this.modalVideoFilename = videoData.filename
    this.openVideoModal = true
    setTimeout(() => {
      $("#videoModal").modal('show');
    }, 500);
  }

  hideVideoModal() {
    document.getElementById('close-modal').click();
  }

  modalDeleteVideo(videoData) {
    this.modalVideoCaption = videoData.caption
    this.modalVideoFilename = videoData.filename
    this.openDeleteModal = true
    setTimeout(() => {
      $("#deleteModal").modal('show');
    }, 500);
  }

  hideDeleteModalDeny() {
    document.getElementById('close-modal-delete').click();
  }

  hideDeleteModalConfirm() {
    this.fileService.deleteFile(this.modalVideoCaption, this.modalVideoFilename)
    this.favouriteService.deleteFileFromFavouriteList(this.modalVideoCaption, this.modalVideoFilename)
    this.fileService.showAllVideosList()
    this.childFilterMatrixComponent.revert()
    document.getElementById('close-modal-delete').click();
  }

  favouriteVideo(videoData) {
    console.log(this.userDetails)
    this.favouriteService.favouriteFile(this.userDetails, videoData)
  }

}
