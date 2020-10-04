import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { UserService } from '../shared/user.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  affix: boolean;
  loggedIn: boolean

  constructor(private userService: UserService) { }

  ngOnInit() { 
    this.userService.isLoggedInNavbar()
    this.userService.isLoggedInSubject.subscribe( (data) => {
      this.loggedIn = data
    })
  }

  // Affix navbar when the window is scrolled
  @HostListener('window:scroll', []) onWindowScroll() {
    const verticalOffset = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop || 0;
    this.affix = verticalOffset > 30;
  }

  logout() {
    this.userService.deleteToken()
    this.userService.isLoggedInNavbar()
  }

}
