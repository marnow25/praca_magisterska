import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Observable, Subject, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  allVideosList: Observable<any>
  public allVideosListSubject = new Subject<any>()

  public uploadSuccessFlagSubject = new BehaviorSubject<any>(false)

  public uploadFailFlagSubject = new BehaviorSubject<any>(false)

  public matrixFilterListSubject = new BehaviorSubject<any>([])

  public favouriteFilterListSubject = new BehaviorSubject<any>([])

  constructor(private http: HttpClient) {
    this.allVideosList = this.allVideosListSubject.asObservable();
  }

  public updateAllVideosListSubject(data) {
    this.allVideosListSubject.next(data);
  }

  public updateUploadSuccessFlagSubject(data) {
    this.uploadSuccessFlagSubject.next(data);
  }

  public updateUploadFailFlagSubject(data) {
    this.uploadFailFlagSubject.next(data);
  }

  public updateMatrixFilterListSubject(data) {
    this.matrixFilterListSubject.next(data);
  }

  public updateFavouriteFilterListSubject(data) {
    this.favouriteFilterListSubject.next(data);
  }

  public showAllVideosList() {
    return this.http.get(environment.apiBaseUrl + '/videos-list', { observe: "response" }).subscribe(data => {
      if (data.body['success']) {
        this.updateAllVideosListSubject(this.parseFilterResponse(data.body['files']))
      } else {
        this.updateAllVideosListSubject(data.body['message'])
      }
    })
  }

  public downloadAllVideos() {
    return this.http.get(environment.apiBaseUrl + '/video-all-download', { observe: "response" }).subscribe(data => { }, err => { console.log(err) })
  }

  public filterVideosList(caption: string, tags?: Array<string>, dateFrom?, dateTill?) {
    if (typeof tags !== 'undefined' && tags) {
      const tagsString = tags.join('&')
      if (typeof dateFrom !== 'undefined' && dateFrom && typeof dateTill !== 'undefined' && dateTill) {
        this.http.get(environment.apiBaseUrl + '/videos-list' + '/' + caption + '/' + tagsString + '/' + dateFrom + '/' + dateTill, { observe: "response" }).subscribe(data => {
          this.updateAllVideosListSubject(this.parseFilterResponse(data.body['files']))
        },
          err => { console.log(err) }
        )
      } else {
        this.http.get(environment.apiBaseUrl + '/videos-list' + '/' + caption + '/' + tagsString, { observe: "response" }).subscribe(data => {
          this.updateAllVideosListSubject(this.parseFilterResponse(data.body['files']))
        },
          err => { console.log(err) }
        )
      }
    } else if (dateFrom && dateTill) {
      this.http.get(environment.apiBaseUrl + '/videos-list' + '/' + caption + '/' + dateFrom + '/' + dateTill, { observe: "response" }).subscribe(data => {
        this.updateAllVideosListSubject(this.parseFilterResponse(data.body['files']))
      },
        err => { console.log(err) }
      )
    } else {
      this.http.get(environment.apiBaseUrl + '/videos-list' + '/' + caption, { observe: "response" }).subscribe(data => {
        this.updateAllVideosListSubject(this.parseFilterResponse(data.body['files']))
      },
        err => { console.log(err) })
    }
  }

  private parseFilterResponse(files) {
    files = this.sortByDate(files)
    files = this.sortByCaption(files)
    let filesNameList = []
    for (let key in files) {
      const fileStartDate = this.extractDate(files[key].metadata.date)
      filesNameList.push({ fileName: files[key].filename, caption: files[key].metadata.caption, camera: files[key].metadata.camera, fileStartDate: fileStartDate })
    }
    filesNameList.push({ captionsList: this.countCaptions(filesNameList) })
    return filesNameList
  }

  private extractDate(date) {
    let dateTmp = new Date(date)
    let dateStr = dateTmp.toString()
    let dateArray = dateStr.split(' ')
    dateArray = dateArray.slice(1, 5)
    return dateArray
  }

  private countCaptions(filesNameList) {
    let captionsList = []
    for (let key in filesNameList) {
      if (!captionsList.includes(filesNameList[key].caption))
        captionsList.push(filesNameList[key].caption)
    }
    return captionsList
  }

  private sortByDate(files) {
    files = files.sort(function (a, b) {
      return (a.metadata.date < b.metadata.date) ? -1 : ((a.metadata.date > b.metadata.date) ? 1 : 0);
    })
    return files
  }

  private sortByCaption(files) {
    files = files.sort(function (a, b) {
      return (a.metadata.caption < b.metadata.caption) ? -1 : ((a.metadata.caption > b.metadata.caption) ? 1 : 0);
    })
    return files
  }

  public uploadFile(formData) {
    this.http.post(environment.apiBaseUrl + '/video-upload', formData, { observe: "response" }).subscribe(data => {
      if (data.body['success']) {
        this.updateUploadSuccessFlagSubject(true)
      } else {
        this.updateUploadFailFlagSubject(true)
      }
    })
  }

  public deleteFile(caption, filename) {
    this.http.get(environment.apiBaseUrl + '/video-delete' + '/' + caption + '/' + filename, { observe: "response" }).subscribe(
      (data) => { }, err => { console.log(err) })
  }

  public filterMatrixVideosList(caption: string, tags: Array<string>, dateFrom, dateTill) {
    this.http.get(environment.apiBaseUrl + '/videos-list-matrix' + '/' + caption + '/' + tags + '/' + dateFrom + '/' + dateTill, { observe: "response" }).subscribe(data => {
      this.updateMatrixFilterListSubject(this.parseMatrixFilterResponse(data.body['files']))
    },
      err => {
        console.log(err)
      })

  }

  private parseMatrixFilterResponse(files) {
    files = this.sortByDate(files)
    files = this.sortByCaption(files)
    let filesNameList = []
    for (let key in files) {
      filesNameList.push({ fileName: files[key].filename, caption: files[key].metadata.caption })
    }
    return filesNameList
  }

  public filterFavouriteVideosList(videosList) {
    let params = new HttpParams();
    params = params.append('videosList', videosList);
    this.http.post(environment.apiBaseUrl + '/videos-list-favourite', { params: params }, { observe: "response" }).subscribe(data => {
      this.updateFavouriteFilterListSubject(data.body["files"])
    })
  }

}
