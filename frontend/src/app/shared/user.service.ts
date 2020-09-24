import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { environment } from '../../environments/environment'
import { User } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User = {
    login: '',
    email: '',
    password: ''
  }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True'}) };

  constructor(private http: HttpClient) { }

  // HTTP Methods

  postUser(user: User) {
    return this.http.post(environment.apiBaseUrl + '/api/register', user, this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post(environment.apiBaseUrl + '/api/authenticate', authCredentials, this.noAuthHeader);
  }

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/api/userProfile');
  }

  // JWT Helper methods

  setToken(token: string) {
    localStorage.setItem('token', token)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  deleteToken() {
    localStorage.removeItem('token')
  }

  getUserPayload() {
    var token = this.getToken()
    if (token) {
      var userPayload = atob(token.split('.')[1])
      return JSON.parse(userPayload)
    }
    else
      return null
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload()
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
  }
}
