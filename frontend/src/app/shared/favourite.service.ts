import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  constructor(private http: HttpClient, private fileService: FileService) { }

  public favouriteFile(userDetails, videoData) {
    let params = new HttpParams();
    params = params.append('login', userDetails.login);
    params = params.append('email', userDetails.email);
    params = params.append('filename', videoData.filename);
    params = params.append('caption', videoData.caption);
    this.http.post(environment.apiBaseUrl + '/api/favourite/', { params: params }, { observe: "response" }).subscribe(
      data => { }
    )
  }

  public getFavouriteVideosList(userData) {
    let params = new HttpParams();
    params = params.append('login', userData.login);
    params = params.append('email', userData.email);
    return this.http.post(environment.apiBaseUrl + '/api/favouriteList/', { params: params }, { observe: "response" }).subscribe(data => {
      if (data.body["success"] === true) {
        this.fileService.filterFavouriteVideosList(data.body['files'])
      } else {
        this.fileService.updateFavouriteFilterListSubject([])
      }
    })
  }

  public deleteFileFromFavouriteListDepeningOnUser(userData, videoData) {
    let params = new HttpParams();
    params = params.append('login', userData.login);
    params = params.append('email', userData.email);
    params = params.append('caption', videoData.caption);
    params = params.append('filename', videoData.filename);
    return this.http.post(environment.apiBaseUrl + '/api/delete-favourite-item-on-user/', { params: params }, { observe: "response" }).subscribe(data => {
      this.getFavouriteVideosList(userData)
    })
  }

  public deleteFileFromFavouriteList(videoCaption, videoFilename) {
    let params = new HttpParams();
    params = params.append('caption', videoCaption);
    params = params.append('filename', videoFilename);
    return this.http.post(environment.apiBaseUrl + '/api/delete-favourite-item/', { params: params }, { observe: "response" }).subscribe(data => { }, err => { console.log(err) })
  }

  public parseFavouriteVideosList(videosList) {
    let parseVideoArray = []
    for (let key in videosList) {
      const date = this.extractDate(videosList[key][0].metadata.date)
      parseVideoArray.push({ caption: videosList[key][0].metadata.caption, filename: videosList[key][0].filename, camera: videosList[key][0].metadata.camera, tags: videosList[key][0].metadata.tags, date: date })
    }
    return parseVideoArray
  }

  private extractDate(date) {
    let dateTmp = new Date(date)
    let dateStr = dateTmp.toString()
    let dateArray = dateStr.split(' ')
    dateArray = dateArray.slice(1, 5)
    return dateArray
  }
}


