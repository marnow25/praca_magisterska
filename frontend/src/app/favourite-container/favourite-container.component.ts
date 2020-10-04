import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../shared/user.service'
import { FavouriteService } from '../shared/favourite.service';
import { FileService } from '../shared/file.service';

@Component({
  selector: 'app-favourite-container',
  templateUrl: './favourite-container.component.html',
  styleUrls: ['./favourite-container.component.css']
})
export class FavouriteContainerComponent implements OnInit {

  constructor(private userService: UserService, private favouriteService: FavouriteService, private fileService: FileService, private changeDetectorRef: ChangeDetectorRef ) { }

  userData
  favouriteVideoList
  renderComponent = false

  ngOnInit() {
    this.userService.getUserProfile().subscribe( (data) => {
      this.userData = data['user']
      this.favouriteService.getFavouriteVideosList(this.userData)
    })
    this.fileService.favouriteFilterListSubject.subscribe( (data) => {
      this.changeDetectorRef.detectChanges();
      if(data.length !== 0) {
        this.favouriteVideoList = this.favouriteService.parseFavouriteVideosList(data)
        this.renderComponent = true
      } else {
      this.favouriteVideoList = data
      this.renderComponent = true
      }
    })
  }

  splitTags(tags) {
    let tagsString = tags.join(', ')
    return tagsString
  }

  splitDate(date) {
    let dateString = date.join(' ')
    return dateString
  }

  captureFrame(htmlIds) {
    const videoId = htmlIds.id + "_video_" + htmlIds.caption + "_" + htmlIds.camera + "_" + htmlIds.fileName
    const canvasId = htmlIds.id + "_canvas_" + htmlIds.caption + "_" + htmlIds.camera + "_" + htmlIds.fileName
    let video = document.getElementById(videoId)
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement
    let firstChild = video.children[0]
    let secondChildOfFirstChild = firstChild.children[1] as HTMLVideoElement
    canvas.width = secondChildOfFirstChild.videoWidth;
    canvas.height = secondChildOfFirstChild.videoHeight;
    canvas.getContext('2d').drawImage(secondChildOfFirstChild, 0, 0, secondChildOfFirstChild.videoWidth, secondChildOfFirstChild.videoHeight)
    let link = document.createElement('a');
    let filename = htmlIds.fileName.replace(/\.[^.]+$/, '');
    let currentTime = secondChildOfFirstChild.currentTime
    filename = filename + '_' + 'second_' + currentTime + '.png'
    link.setAttribute('href', canvas.toDataURL().replace(/^data:image\/[^;]*/, 'data:application/octet-stream'),);
    link.setAttribute('target', '_blank');
    link.setAttribute('download', filename);
    if (document.createEvent) {
      var evtObj = document.createEvent('MouseEvents');
      evtObj.initEvent('click', true, true);
      link.dispatchEvent(evtObj);
    } else if (link.click) {
      link.click();
    }
  }

  changeSpeed(speed, htmlIds) {
    const videoId = htmlIds.id + "_video_" + htmlIds.caption + "_" + htmlIds.camera + "_" + htmlIds.fileName
    let video = document.getElementById(videoId)
    let firstChild = video.children[0]
    let secondChildOfFirstChild = firstChild.children[1] as HTMLVideoElement
    secondChildOfFirstChild.playbackRate = speed
  }

  unfavouriteVideo(htmlIds) {
    this.favouriteService.deleteFileFromFavouriteListDepeningOnUser(this.userData, htmlIds)
  }

}
