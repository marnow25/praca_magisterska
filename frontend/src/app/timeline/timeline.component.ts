import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit, OnChanges {

  camerasArray;
  cameraVideosGroupArray;
  restoreDefaultPositionDrag = false

  @Input()
  videosArray;

  constructor() { }

  ngOnChanges() {
    this.camerasArray = this.countCameras(this.videosArray)
    this.cameraVideosGroupArray = this.divideVideosByCamera(this.camerasArray, this.videosArray)
  }

  ngOnInit() {
    this.camerasArray = this.countCameras(this.videosArray)
    this.cameraVideosGroupArray = this.divideVideosByCamera(this.camerasArray, this.videosArray)
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

  countCameras(videosArray) {
    let camerasList = []
    for (let key in videosArray) {
      if (!camerasList.includes(videosArray[key].camera))
        camerasList.push(videosArray[key].camera)
    }
    return camerasList.sort()
  }

  divideVideosByCamera(cameraArray, videosArray) {
    let resultArray = []
    let videosArrayTmp = videosArray
    for (let cameraKey in cameraArray) {
      let tmpArray = []
      for (let vidKey in videosArrayTmp) {
        if (videosArrayTmp[vidKey].camera === cameraArray[cameraKey])
          tmpArray.push(videosArrayTmp[vidKey])
      }
      resultArray.push(tmpArray)
    }
    return resultArray
  }

  onDragEnded(event): void {
    if (this.restoreDefaultPositionDrag) {
      this.restoreDefaultPositionDrag = false
      event.source._dragRef.reset();
    }
  }

  myFunction() {
    this.restoreDefaultPositionDrag = true
  }

}
