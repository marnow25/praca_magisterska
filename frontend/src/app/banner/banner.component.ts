import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  slides = [
    { image: "assets/img/baner1.jpg" }, 
    { image: "assets/img/baner2.jpg" }, 
    { image: "assets/img/baner3.jpg" }
  ]

}
